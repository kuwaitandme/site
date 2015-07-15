# TODO avoid editing of banned classifieds..
Promise        = require "bluebird"
_              = require "underscore"
formidable     = require "formidable"
observableDiff = (require "deep-diff").observableDiff
validator      = require "validator"


exports = module.exports = (IoC, reCaptcha, uploader, Email, Classifieds,
Events, Notifications, Users) ->
  logger = IoC.create "igloo/logger"


  ###*
   * Start parsing the multi-part encoded data
   *
   * @param  Object request         The Express request object
   *
   * @return Promise                A Promise that resolves if the form could
   *                                be parsed properly. The request, parsed
   *                                fields and files that have been uploaded
   *                                are attached to this promise.
  ###
  parseForm = (request) -> new Promise (resolve, reject) ->
    # Check for the id..
    id = request.params[0]
    if not id? or not validator.isInt id, {min: 0}
      reject new Error "need valid id"

    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 10MB

    # Setup error handler. This function gets called whenever there is an
    # error while processing the form.
    form.on "error", (error) -> reject error

    # Start parsing the form
    form.parse request, (error, fields, filesRequest) ->
      if error then reject error
      resolve Promise.props
        fields: fields
        files: filesRequest["images[]"]
        id: id
        request: request


  ###*
   * Validate the request and clean it properly before creating the classified.
   *
   * @param  Promise.props promise         The promise object from the previous
   *                                       function
   *
   * @return Promise.props                 The original promise with the
   *                                       cleaned classified attached as
   *                                       'classified'
  ###
  validateRequest = (promise) ->
    user = promise.request.user or {}
    fields = promise.fields

    # Check if the classified field is set properly.
    if not fields.classified? then throw new Error "missing classified field"

    # Check and parse the JSON string that was sent.
    if not validator.isJSON fields.classified
      throw new Error "classified field is not a JSON"
    classified = JSON.parse fields.classified

    # Save the filesToDelete array later on..
    promise.filesToDelete = classified.filesToDelete or []

    # Check if the user is logged in.
    if not promise.request.isAuthenticated() then throw new Error "need login"

    # Check if the user has the right privileges to edit this classified
    owner = promise.oldClassified.get "owner"
    user = promise.request.user or {}
    if owner != user.id and not
    ((Users.isAdmin user) or (Users.isModerator user))
      throw new Error "not privileged"

    # Check if the classified can be modified..
    if promise.oldClassified.get("status") in [
      Classifieds.statuses.BANNED
      Classifieds.statuses.FLAGGED
      Classifieds.statuses.REJECTED
    ] then throw new Error "classified won't be edited"

    # Clean the classified (remove any XSS code).
    classified = Classifieds.clean classified

    # Check if the JSON is valid. (This function automatically throws an error
    # if it's not).
    Classifieds.validate classified

    # All good, so attach the classified to the promise and continue!
    promise.newClassified = classified
    promise


  ###*
   * This function creates a diff between the old and new classified.
   *
   * @param  Promise.props promise         The promise object from the previous
   *                                       function
   *
   * @return Promise.props                 The original promise with the
   *                                       diff now attached.
  ###
  createDiff = (promise) ->
    newClassified = promise.newClassified
    oldClassified = promise.oldClassified
    newImages = promise.newImages
    classifiedDiff = {}

    # Now start processing a diff of the classified
    # See: https://www.npmjs.com/package/deep-diff
    observableDiff oldClassified.toJSON(), newClassified, (diff) ->
      if not diff.path? then return
      key = diff.path[0]

      # Don't edit any fields that are supposed to be 'final'
      if key in Classifieds.finalFields then return

      # For JSON fields, use JSON.stringify to save new results, or
      # else the DB will throw an 'invalid json' error.
      if key in Classifieds.jsonFields
        # Avoid editing the images field
        if key is "images" then return
        classifiedDiff[key] = JSON.stringify newClassified[key]

      # For all other fields, simply assign directly.
      else classifiedDiff[key] = newClassified[key]

    # Here we remove the images that are in the server with the images
    # that have been flagged to be deleted and we also include any newly
    # added images.
    finalImages = []
    images = newClassified.images or []
    activeImages = 0
    for image in images
      if activeImages >= 12
        # We have exceeded our limit for images, start deleting all
        # remaining images
        #   TODO: delete them now
      else if image.filename in promise.filesToDelete
        # do something with this file as it has been flagged to be deleted
        #   TODO: delete them now
      else
        # Unlike the post function, for every image we need to find the image
        # pair from the uploader and from the original image meta data.
        #
        # This block takes care of iterating through each of the images and
        # properly adding images that have just been added into the diff.
        found = false
        for newImage in newImages
          if newImage.oldFilename is image.filename and
          not newImage.alreadyAdded
            found = true
            if newImage.isUploaded
              # This image is new and was uploaded successfully.
              newImage.alreadyAdded = true
              image.filename = newImage.newFilename
              image.color = newImage.color
              finalImages.push image
            break

        # This file has been unchanged, so simply add it without any changes.
        #
        # FIX: This can cause unwanted paths being set..
        if not found then finalImages.push image

        # Increment this counter so that we stay within the limit of images
        # per classified.
        activeImages++

    # The final set of images, will be the images after deletion and
    # the new set of images.
    classifiedDiff.images = JSON.stringify finalImages

    # Attach the diff and return
    logger.debug classifiedDiff
    promise.diff = classifiedDiff
    promise


  ###*
   * Once the diff has been created, this function creates a notification iff
   * the classified's status has just been set to ACTIVE. Because setting a
   * classified as ACTIVE can only be done by a moderator/admin, we need to
   * notify the actual owner of the classified that his/her classified has been
   * approved.
   *
   * Basically this function creates a notification and an email and sends it to
   * the owner iff the classified has been approved.
   *
   * @param  Promise.props promise   The promise object from the previous
   *                                 function.
   *
   * @return Promise.props           The same promise, unchanged.
  ###
  createNotification = (promise) ->
    classified = promise.newClassified

    # Check if the user has the super privileges (to change the status of the
    # classified)
    user = promise.request.user or {}
    isSuper = (Users.isAdmin user) or (Users.isModerator user)

    # If the classified has been set to ACTIVE (which can only be done by a
    # moderator/admin).
    if promise.diff.status is Classifieds.statuses.ACTIVE
      if not isSuper then throw new Error "not privileged"

      # Then publish a notification to the user
      Notifications.create promise.request, "CLASSIFIED_ACTIVE",
        id: classified.id

      # And also send an email.
      Users.get classified.owner
      .then (user) -> user.get "email"
      .then (email) ->
        mailOptions = classified: classified
        [
          "Your classified is approved"
          email
          "classified/approved"
          mailOptions
        ]
      .spread Email.sendTemplate

    # Now every time a change has been made, it will have to get reviewed by
    # an Admin/Moderator. So automatically revert the classified back to
    # INACTIVE...
    else if not isSuper then promise.diff.status = Classifieds.statuses.INACTIVE

    promise


  # The API call starts executing from here
  (request, response, next) ->
    reCaptcha.verify request
    .then parseForm

    .then (promise) ->
      promise.oldClassified = Classifieds.get promise.id
      Promise.props promise

    .then validateRequest

    # Upload the files into the server using the uploader's promise..
    .then (promise) ->
      options = prefix: promise.id
      promise.newImages = uploader.upload promise.files, options
      Promise.props promise

    .then createDiff
    .then createNotification
    .then (promise) -> [promise.oldClassified.id, promise.diff]

    # Log the event into the database!
    .spread (id, json) ->
      Events.log request, "CLASSIFIED_EDIT", classified: id
      [id, json]

    .spread Classifieds.patch

    # Once done, return the fields that have been changed back to the user
    .then (result) -> response.json result.toJSON()

    # Error handler. Return all errors as 400s (including 500's)
    .catch (error) ->
      logger.error error
      next (error.status = 400) and error


exports["@require"] = [
  "$container"
  "controllers/recaptcha"
  "controllers/uploader"
  "libraries/email"

  "models/classifieds"
  "models/events"
  "models/notifications"
  "models/users"
]
exports["@singleton"] = true
