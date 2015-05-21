Promise           = require "bluebird"
formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

exports = module.exports = (IoC, email, reCaptcha, uploader, Classifieds,
Users) ->
  logger = IoC.create "igloo/logger"
  name = "[api:classifieds]"

  _createURLslug = (classified) ->
    maxLength = 120
    # Trim the string to the maximum length
    title = classified.title
    if title.length > maxLength then title = title.substr 0, maxLength
    # Get the keywords and make a sentence seperated by '-'s. We use this regex
    # so that we don't exclude arabic characters. Ideally we want all to get
    # rid of all non-alphabetic characters, but arabic words might get erased
    # too. If the title had arabic characters, then we simple leave the url
    # alone and instead a 'classified' prefix to the slug.
    regex = /[a-zA-Z0-9]+/g
    components = (title.match regex) or ["classified"]
    keywords = encodeURIComponent components.join "-"
    # Finally generate the slug and return it
    slug = "#{keywords.toLowerCase()}-#{classified.id}"


  # Start parsing the multi-part encoded data
  parseForm = (request) -> new Promise (resolve, reject) ->
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
      # The classified data gets passed as a JSON string, so here we parse it
      data = JSON.parse fields.classified

      currentUser = request.user or {}
      if currentUser.id
        # Set the current user as the owner for this classified.
        data.owner = currentUser.id
        resolve [data, filesRequest["images[]"]]
      else
        s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
        newPassword = "#{s4()}-#{s4()}-#{s4()}"

        # Else create a temporary user and make it the owner for this
        # classified.
        Users.createTemporary data.contact.email, newPassword, (error, user) ->
          if error? then return reject error

          # Send an email informing about the new temporary account.
          email.sendTemplate data.contact.email, "temporaryCreatedUser",
            subject: "An account has been made for you"
            user: email: data.contact.email, password: newPassword

          data.owner = user.id
          request.logIn user, (error) ->
            resolve [data, filesRequest["images[]"]]


  # Create a new classified
  createClassified = (newClassified, uploadedFiles) ->
    new Promise (resolve, reject) ->
      imagesMeta = newClassified.images
      delete newClassified.images

      newClassifiedFiltered = Classifieds.filter newClassified
      Classifieds.create newClassifiedFiltered, (error, classified) ->
        if error then return reject error
        resolve [classified, uploadedFiles, imagesMeta]


  # Here we validate and save the files that get returned from the formidable
  # object.
  uploadFiles = (newClassified, filesToUpload, imagesMeta) ->
    new Promise (resolve, reject) ->
      options = prefix: newClassified.id
      uploader.upload filesToUpload, options, (error, newImages=[]) ->
        if error then reject error
        else resolve [newClassified, newImages, imagesMeta]


  # Finally update the classified with the diff into the DB.
  updateClassified = (newClassified, newImages=[], imagesMeta) ->
    new Promise (resolve) ->
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
      newClassified.set "slug", _createURLslug newClassified.toJSON()
      newClassified.set "images", JSON.stringify finalImages
      # Update the classified with the images and return the result to the user.
      newClassified.save().then (classified) -> resolve classified.toJSON()


  # Send an email about the new classified
  emailUser = (classified) ->
    email.sendTemplate classified.contact.email, "classifiedSubmitted",
      subject: "Your classified has been submitted", classified: classified
    classified


  controller = (request, response, next) ->
    reCaptcha.verify request
    .then parseForm
    .spread createClassified
    .spread uploadFiles
    .spread updateClassified
    .then emailUser
    .then (classified) ->
      # Once done, return the fields that have been changed back to the user
      logger.debug name, classified
      response.json classified
    .catch (error) ->
      # If there were any errors, return it with a default 400 HTTP code.
      logger.error error.stack
      response.status error.status or 400
      response.json error.message


exports["@require"] = [
  "$container"
  "controllers/email"
  "controllers/recaptcha"
  "controllers/uploader"

  "models/classifieds"
  "models/users"
]
exports["@singleton"] = true