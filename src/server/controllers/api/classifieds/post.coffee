###*
 * This controller is responsible for creating a new classified. It takes care
 * of uploading the images, parsing the request, saving the classified and
 * sending an email to creator. It also handles errors and returns them in JSON.
 *
 * @param String classified      A JSON (string-encoded) of the classified to
 *                               be uploaded
 * @param File images[]          An array of files that is to be uploaded.
 * @required classified
 *
 * @example
 * POST multipart/form-data sitename.tld/api/classifieds -> JSON
 *
 * @author Steven Enamakel <me@steven.pw>
###

Promise           = require "bluebird"
validator         = require "validator"
formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"


###*
 * This helper function creates a nice URL slug, taking the title and spitting
 * a URL which is truly unique.
 *
 * @param  Number id         The id of the classified. This gets appended to the
 *                           URL slug to make it truely unique.
 * @param  String title      The title of the classified. This string gets
 *                           converted to snake-case removing all junk
 *                           characters.
 *
 * @return String            The generated URL slug.
###
createURLslug = (id, title) ->
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


exports = module.exports = (IoC, Email, reCaptcha, uploader, Classifieds,
Events, Users) ->
  logger = IoC.create "igloo/logger"
  name = "[api:classifieds]"


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
    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 10MB

    # Setup error handler. This function gets called whenever there is an
    # error while processing the form.
    form.on "error", (error) -> reject error

    # Start parsing the form
    form.parse request, (error, fields={}, filesRequest) ->
      if error then reject error
      resolve Promise.props
        fields: fields
        files: filesRequest
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

    # Check if the user is logged in.
    if not promise.request.isAuthenticated() then throw new Error "need login"

    # Check if the JSON is valid. (This function automatically throws an error
    # if it's not).
    Classifieds.validate classified

    # Clean the classified (remove any XSS code).
    classified = Classifieds.clean classified

    # Set the current user as the owner for this classified.
    classified.owner = user.id

    # Also override the email field. (In case the user manages to send a
    # malformed request).
    classified.contact ?= {}
    classified.contact.email ?= user.get "email"

    # Give the default slug and status (so that the DB INSERT stays happy!).
    classified.slug = ""
    classified.status = Classifieds.statuses.INACTIVE

    # All good, so attach the classified to the promise and continue!
    promise.classified = classified
    promise


  ###*
   *  Update the classified with the slug and images into the DB. This function
   *  executes once the classified has been inserted into the DB and makes use
   *  of the generated id to set up more parameters.
   *
   * @param  Promise.props promise         The promise from the previous
   *                                       function.
   *
   * @return Promise.props                 A promise that stays the same but
   *                                       creates a slug and adds the image
   *                                       data to the new classified.
  ###
  updateData = (promise) ->
    # If an image was uploaded find it's metadata and add it to the list of
    # final images
    finalImages = []
    for newImage in (promise.newImages or [])
      for imageMeta in imagesMeta
        if newImage.oldFilename is imageMeta.filename and newImage.isUploaded
          imageMeta.filename = newImage.newFilename
          imageMeta.color = newImage.color
          finalImages.push imageMeta

    # Once the final images have been set, we update the images..
    promise.newClassified.set "images", JSON.stringify finalImages

    # Get the slug for the classified using the newly generated id and
    # set the images field with our final set of images.
    promise.newClassified.set "slug",
      createURLslug promise.newClassified.id, promise.newClassified.get "title"

    promise


  ###*
   * Send an email to the creator informing about the new classified.
   *
   * @param  Bookshelf.model classified      The updated classified from the
   *                                         DB
   *
   * @return Bookshelf.model                 The same classified that was passed
   *                                         as an argument (unchanged).
  ###
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
    .then validateRequest

    # Create the classified and extract the image meta-data
    .then (promise) ->
      promise.imagesMeta = promise.classified.images
      delete promise.classified.images

      promise.newClassified = Classifieds.create promise.classified
      # Resolve and return
      Promise.props promise

    # Here we validate and save the files that get returned from the formidable
    # object.
    .then (promise) ->
      options = prefix: promise.newClassified.id
      promise.newImages = uploader.upload promise.files, options

      # Resolve and return
      Promise.props promise

    .then updateData
    .then (promise) ->
      # Prepare the return array that gets passed to the Classified.patch method
      [promise.newClassified.id, promise.newClassified.toJSON()]

    # Log the event into the database!
    .spread (id, json) ->
      Events.log request, "CLASSIFIED_CREATE", classified: id
      [id, json]

    .spread Classifieds.patch
    .then emailUser

    # Once done, return the entire classified back to the user
    .then (classified) ->
      logger.debug name, classified
      response.json classified

    # Error handler. Return all errors as 400s (including 500's)
    .catch (error) ->
      logger.debug error.stack
      next (error.status = 400) and error


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
