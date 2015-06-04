Promise        = require "bluebird"
_              = require "underscore"
formidable     = require "formidable"
observableDiff = (require "deep-diff").observableDiff
xss            = require "xss"


exports = module.exports = (IoC, reCaptcha, uploader, Classifieds, Events
Users) ->
  logger = IoC.create "igloo/logger"

  # Check if the request has the required data
  checkRequest = (request) ->
    id = request.params[0]
    if not request.isAuthenticated() then throw new Error "need login"
    else if not id? then throw new Error "need valid id"
    else id

  # Check if user has privileges to modify the classified
  checkUserPrivelages = (results) ->
    console.log results
    # Grab the request and the classified (sent by the prev promise)
    request = results.request
    oldClassified = results.classified
    # Fetch the user
    owner = oldClassified.get "owner"
    user = request.user or {}
    # Validate!
    if owner != user.id and not
    ((Users.isAdmin user) or (Users.isModerator user))
      throw new Error "not privileged"
    [request, oldClassified]

  # Start parsing the multi-part encoded data
  parseForm = (request, oldClassified) -> new Promise (resolve, reject) ->
    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 10MB
    # Setup error handler. This function gets called whenever there is an
    # error while processing the form.
    form.on "error", (error) -> throw error
    # Start parsing the form
    form.parse request, (error, fields, filesRequest) ->
      if error then reject error
      resolve [oldClassified, request, fields, filesRequest]

  # Analyze the data from fromidable.
  analyzeData = (oldClassified, request, fields, files) ->
    # The classified data gets passed as a JSON string, so here we parse it
    # first.
    newClassified = JSON.parse fields.classified
    user = request.user or {}
    # Check first if the user is logged in
    if not user.id then throw new Error "need login"
    # Find out how many credits we will have to spend.
    promotePrice = newClassified.spendPromotePerk
    urgentPrice = newClassified.spendUrgentPerk
    creditsToSpend = urgentPrice + promotePrice
    if creditsToSpend > 0
      # Evaluate the perks with the given user and the credits
      newClassified = Classifieds.evaluatePerks newClassified, user.toJSON(),
        promote: promotePrice
        urgent: urgentPrice
      # Send an event about how many credits the user spent
      eventData =
        id: oldClassified.id
        type: "cl"
        spent:
          promote: promotePrice
          urgent: urgentPrice
      Events.log request, "CREDITS_SPENT", eventData
      # Update the user with the new amount of credits
      (user.set "credits", (user.get "credits") - creditsToSpend).save()
    # Set the current user as the owner for this classified.
    newClassified.owner = user.id
    # Also override the email field. (In case the user manages to send a
    # malformed request)
    newClassified.contact ?= {}
    newClassified.contact.email ?= user.get "email"
    [newClassified, oldClassified, files["images[]"]]

  # This function creates a diff between the old and new classified.
  createDiff = (newClassified, oldClassified, newImages) ->
    new Promise (resolve) ->
      # Now start processing a diff of the classified
      classifiedDiff = {}
      filteredClassified = Classifieds.filter newClassified
      # console.log filteredClassified
      observableDiff oldClassified.toJSON(), filteredClassified, (diff) ->
        if not diff.path? then return
        key = diff.path[0]
        # Don't edit any fields that are supposed to be 'final'
        if key in Classifieds.finalFields then return
        # For JSON fields, use JSON.stringify to save new results, or
        # else pg will throw an 'invalid json' error.
        if key in Classifieds.jsonFields
          # Avoid editing the images field
          if key is "images" then return
          classifiedDiff[key] = JSON.stringify newClassified[key]
        # For all other fields, simply assign directly.
        else classifiedDiff[key] = newClassified[key]
      # Here we remove the images that are in the server with the images
      # that have been flagged to be deleted.
      finalImages = []
      filesToDelete = newClassified.filesToDelete or []
      images = newClassified.images or []
      activeImages = 0
      for image in images
        if activeImages >= 12
          # We have exceeded our limit for images, start deleting all
          # remaining images
          #   TODO: delete them now
        else if image.filename in filesToDelete
          # do something with this file as it has been flagged to be deleted
          #   TODO: delete them now
        else
          found = false
          for newImage in newImages
            if newImage.oldFilename is image.filename
              found = true
              if newImage.isUploaded
                # This image is new and was uploaded successfully.
                image.filename = newImage.newFilename
                image.color = newImage.color
                finalImages.push image
              break
          # This file has been unchanged, so simply add it without any changes.
          if not found then finalImages.push image
          # Increment this counter so that we stay within the limit of images
          # per classified.
          activeImages++
      # The final set of images, will be the images after deletion and
      # the new set of images.
      classifiedDiff.images = JSON.stringify finalImages
      logger.debug classifiedDiff
      resolve [oldClassified.id, classifiedDiff]

  (request, response, next) ->
    reCaptcha.verify request
    # Check if the parameters in the request are proper or not.
    .then checkRequest
    # Validation has been done, the request is proper, Fetch the classified
    .then Classifieds.getPromise
    # Restructure the output to contain the request
    .then (classified) -> Promise.props classified: classified, request: request
    # Check if the user has the privelages to modify this classified.
    .then checkUserPrivelages
    # Start parsing the multi-part data
    .spread parseForm
    # Then analyze the data, taking care of the perks.
    .spread analyzeData
    # Upload the files into the server
    .spread (newClassified, oldClassified, newImages) ->
      options = prefix: newClassified.id
      [newClassified, oldClassified, uploader.uploadPromise newImages, options]
    # Create a diff between the two classifieds
    .spread createDiff
    # Log the event into the database!
    .spread (id, json) ->
      Events.log request, "CLASSIFIED_EDIT", classified: id
      [id, json]
    # Now update the classified with the diff!
    .spread Classifieds.patchPromise
    # Once done, return the fields that have been changed back to the user
    .then (result) -> response.json result.toJSON()
    # If there were any errors, return it with a default 400 HTTP code.
    .catch (error) ->
      logger.error    error.stack
      response.status error.status or 400
      response.json   error.message


exports["@require"] = [
  "$container"
  "controllers/recaptcha"
  "controllers/uploader"

  "models/classifieds"
  "models/events"
  "models/users"
]
exports["@singleton"] = true
