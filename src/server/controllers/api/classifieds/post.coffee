Promise           = require "bluebird"
validator         = require "validator"
formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

exports = module.exports = (IoC, Email, reCaptcha, uploader, Classifieds,
Events, Users) ->
  logger = IoC.create "igloo/logger"
  name = "[api:classifieds]"

  # Helper function to properly create a URL slug.
  _createURLslug = (id, title) ->
    maxLength = 120
    # Trim the string to the maximum length
    if title.length > maxLength then title = title.substr 0, maxLength
    # Get the keywords and make a sentence separated by '-'s. We use this regex
    # so that we don't exclude Arabic characters. Ideally we want all to get
    # rid of all non-alphabetic characters, but Arabic words might get erased
    # too. If the title had Arabic characters, then we simply leave the url
    # alone and instead a 'classified' prefix to the slug.
    regex = /[a-zA-Z0-9]+/g

    # If nothing matched then give a default prefix of 'classified'
    components = (title.match regex) or ["classified"]

    # Combine all the words with the dash.
    keywords = encodeURIComponent components.join "-"

    # Finally generate the slug and return it
    slug = "#{keywords.toLowerCase()}-#{id}"


  ###*
   * Start parsing the multi-part encoded data
   *
   * @param  {[type]} request [description]
   * @return {[type]}         [description]
  ###
  parseForm = (request) -> new Promise (resolve, reject) ->
    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 10MB
    # Setup error handler. This function gets called whenever there is an
    # error while processing the form.
    form.on "error", (error) -> throw error
    # Start parsing the form
    form.parse request, (error, fields={}, filesRequest) ->
      if error then reject error
      resolve [request, fields, filesRequest]


  validateRequest = (request, fields, files) ->
    # Check if the classified field is set properly
    if not fields.classified?
      throw new Error "missing classified field"

    # Check and parse the JSON string that was sent.
    if not validator.isJSON fields.classified
      throw new Error "classified field is not a JSON"
    classified = JSON.parse fields.classified

    # Check if the user is logged in
    user = request.user or {}
    if not user.id then throw new Error "need login"

    # Check if the required fields are present. This function automatically
    # throws an error based on the classified's JSON
    Classifieds.isValid classified

    # All good, so continue!
    [request, classified, files]


  # Analyze the data from fromidable.
  analyzeData = (request, data, files) ->
    user = request.user or {}
    # Find out how many credits we will have to spend.
    promotePrice = data.spendPromotePerk
    urgentPrice = data.spendUrgentPerk
    creditsToSpend = urgentPrice + promotePrice
    if creditsToSpend > 0
      # Evaluate the perks with the given user and the credits
      data = Classifieds.evaluatePerks data, user.toJSON(),
        urgent: data.spendUrgentPerk
        promote: data.spendPromotePerk
      # Send an event about how many credits the user spent
      eventData =
        type: "cl"
        spent:
          promote: promotePrice
          urgent: urgentPrice
      Events.log request, "CREDITS_SPENT", eventData
      # Update the user with the new amount of credits
      (user.set "credits", (user.get "credits") - creditsToSpend).save()
    # Set the current user as the owner for this classified.
    data.owner = user.id
    # Also override the email field. (In case the user manages to send a
    # malformed request)
    data.contact ?= {}
    data.contact.email ?= user.get "email"
    data.slug = "dummy"
    data.status = Classifieds.statuses.INACTIVE
    [data, files["images[]"]]

  # Finally update the classified with the diff into the DB.
  updateData = (newClassified, imagesMeta, newImages=[]) ->
    # If an image was uploaded find it's metadata and add it to the list of
    # final images
    finalImages = []
    for newImage in newImages
      for imageMeta in imagesMeta
        if newImage.oldFilename is imageMeta.filename and newImage.isUploaded
          imageMeta.filename = newImage.newFilename
          imageMeta.color = newImage.color
          finalImages.push imageMeta
    # Get the slug for the classified using the newly generated id and
    # set the images field with our final set of images.
    newClassified.set "slug", _createURLslug newClassified.id, newClassified.get "title"
    newClassified.set "images", JSON.stringify finalImages
    # Prepare the return array that gets passed to the Classified.patch method
    [newClassified.id, newClassified.toJSON()]

  # Send an email about the new classified
  emailUser = (classified) ->
    contactDetails = classified.get "contact"
    Email.sendTemplate contactDetails.email, "classified/submitted",
      classified: classified.toJSON()
      subject: "Your classified has been submitted"
    classified

  # The API call starts executing from here
  (request, response, next) ->
    # reCaptcha.verify request
    Promise.resolve request
    .then parseForm
    .spread validateRequest
    .spread analyzeData

    # Create the classified and extract the image meta-data
    .spread (data, files) ->
      imagesMeta = data.images
      delete data.images
      [files, imagesMeta, Classifieds.create data]

    # Here we validate and save the files that get returned from the formidable
    # object.
    .spread (newImages, imagesMeta, newClassified) ->
      options = prefix: newClassified.id
      [newClassified, imagesMeta, uploader.upload newImages, options]

    .spread updateData
    # Log the event into the database!
    .spread (id, json) ->
      Events.log request, "CLASSIFIED_CREATE", classified: id
      [id, json]
    .spread Classifieds.patch
    .then emailUser
    # Once done, return the fields that have been changed back to the user
    .then (classified) ->
      logger.debug name, classified
      response.json classified

    # Error handler
    .catch (error) ->
      error.status = 400
      next error


exports["@require"] = [
  "$container"
  "controllers/email"
  "controllers/recaptcha"
  "controllers/uploader"

  "models/classifieds"
  "models/events"
  "models/users"
]
exports["@singleton"] = true
