Promise        = require "bluebird"
_              = require "underscore"
formidable     = require "formidable"
observableDiff = (require "deep-diff").observableDiff


exports = module.exports = (Classifieds, reCaptcha, uploader) ->

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
  parseForm = (form, request) -> new Promise  (resolve) ->
    # Start parsing the form
    form.parse request, (error, fields, filesRequest) ->
      if error then throw error
      # The classified data gets passed as a JSON string, so here we parse it
      data = JSON.parse fields.classified
      resolve [data, filesRequest["images[]"]]


  # Get the classified from the DB
  getClassified = (parsedData, filesToUpload) -> new Promise (resolve) ->
    Classifieds.get parsedData.id, (error, classified) ->
      if error then throw error
      if not classified then throw new Error "classified not found"
      resolve [parsedData, classified.toJSON(), filesToUpload]


  # Here we validate and save the files that get returned from the formidable
  # object.
  uploadFiles = (newClassified, oldClassified, filesToUpload) ->
    new Promise (resolve) ->
      uploader.upload filesToUpload, (error, newImages=[]) ->
        if error then throw error
        resolve [newClassified, oldClassified, newImages]


  # This function creates a diff between the old and new classified.
  createDiff = (newClassified, oldClassified, newImages) ->
    new Promise (resolve) ->
      # console.log newClassified, oldClassified
      # Now start processing a diff of the classified
      classifiedDiff = {}
      filteredClassified = Classifieds.filter newClassified
      # console.log filteredClassified
      observableDiff oldClassified, filteredClassified, (diff) ->
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
      for image in images
        # if images.length > 12
        # We have exceeded our limit for images, start deleting all
        # remaining images
        #   TODO: delete them now
        if image.filename in filesToDelete
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
                imageMeta.color = newImage.color
                finalImages.push image
              break

          # This file has been unchanged, so simply add it without any changes.
          if not found then finalImages.push image
      # The final set of images, will be the images after deletion and
      # the new set of images.
      classifiedDiff.images = JSON.stringify finalImages
      resolve [classifiedDiff, oldClassified]


  # Finally update the classified with the diff into the DB.
  updateClassified = (classifiedDiff, oldClassifiedassified) ->
    new Promise (resolve) ->
      Classifieds.patch oldClassifiedassified.id, classifiedDiff,
        (error, classified) -> resolve classified.toJSON()


  controller = (request, response, next) ->
    Promise.resolve request
    .then reCaptcha.verify
    .then initializeFormReader
    .spread parseForm
    .spread getClassified
    .spread uploadFiles
    .spread createDiff
    .spread updateClassified
    # Once done, return the fields that have been changed back to the user
    .then (classified) -> response.json classified
    # If there were any errors, return it with a default 400 HTTP code.
    .catch (error) ->
      response.status error.status || 400
      response.json error


exports["@require"] = [
  "models/classifieds"
  "controllers/recaptcha"
  "controllers/uploader"
]
exports["@singleton"] = true