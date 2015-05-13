Promise           = require "bluebird"
formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

exports = module.exports = (reCaptcha, uploader, email, Classifieds, Users) ->
  _createURLslug = (classified) ->
    maxLength = 70
    minLength =
    # Get the keywords and make a sentence seperated by '-'s.
    keywords = keyword_extractor.extract classified.title,
      language: "english", remove_duplicates: true, return_changed_case: true
    keywords = keywords.join "-"
    # Clean the string off unwanted characters
    # TODO: check for Arabic characters
    cleanedString = keywords.replace /[^\w- ]+/g, ""
    # Trim the string to the maximum length
    trimmedString = cleanedString.substr 0, maxLength
    # Trim the slug if we are in the middle of a word
    trimmedSentence = trimmedString.substr 0, Math.min trimmedString.length,
      trimmedString.lastIndexOf "-"
    # Finally generate the slug
    slug = "#{trimmedSentence}-#{classified.id}"


  # Initialize a formidable object
  initializeFormReader = (request) ->
    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 10MB
    # Setup error handler. This function gets called whenever there is an
    # error while processing the form.
    form.on "error", (error) -> throw error
    [form, request]


  # Start parsing the multi-part encoded data
  parseForm = (form, request) -> new Promise (resolve, reject) ->
    # Start parsing the form
    form.parse request, (error, fields, filesRequest) ->
      if error then throw error
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
      uploader.upload filesToUpload, (error, newImages=[]) ->
        if error then reject error
        else resolve [newClassified, newImages]


  # Finally update the classified with the diff into the DB.
  updateClassified = (newClassified, newImages, imagesMeta) ->
    new Promise (resolve) ->
      # If an image was uploaded find it's metadata and add it to the list of
      # final images
      finalImages = []
      for newImage in newImages
        for imageMeta in imagesMeta
          if newImage.oldFilename is imageMeta.filename and newImage.isUploaded
            imageMeta.filename = newImage.newFilename
            finalImages.push imageMeta

      # Get the slug for the classified using the newly generated id and
      # set the images field with our final set of images.
      newClassified.set "slug", _createURLslug newClassified.toJSON()
      newClassified.set "images", JSON.stringify finalImages
      # Update the classified with the images and return the result to the user.
      newClassified.save().then (classified) -> resolve classified.toJSON()


  # Send an email about the new classified
  emailUser = (classified) ->
    email.sendTemplate "stevent95@gmail.com", "classifiedSubmitted",
      subject: "Your classified has been submitted", classified: classified
    classified


  controller = (request, response, next) ->
    Promise.resolve request
    .then reCaptcha.verify
    .then initializeFormReader
    .spread parseForm
    .spread createClassified
    .spread uploadFiles
    .spread updateClassified
    .then emailUser
    # Once done, return the fields that have been changed back to the user
    .then (classified) -> response.json classified
    # If there were any errors, return it with a default 400 HTTP code.
    .catch (error) ->
      response.status error.status || 400
      response.json error.message


exports["@require"] = [
  "controllers/recaptcha"
  "controllers/uploader"
  "controllers/email"

  "models/classifieds"
  "models/users"
]
exports["@singleton"] = true