formidable     = require "formidable"
observableDiff = (require "deep-diff").observableDiff
_              = require "underscore"

exports = module.exports = (Classifieds, reCaptcha, uploader) ->
  controller = (request, response, next) ->
    captchaFail = ->
      response.status 401
      response.json "captcha failed"

    captchaSuccess = ->
      # Initialize formidable
      form = new formidable.IncomingForm
      form.keepExtensions = true
      form.multiples = true
      form.maxFieldsSize = 10 * 1024 * 1024 # 2MB

      # Setup error handler. This function gets called whenever there is an
      # error while processing the form.
      form.on "error", (error) ->
        response.status 400
        response.json error


      # Start parsing the form
      form.parse request, (error, fields, filesRequest) ->
        if error
          response.status 400
          return response.json error

        # The classified data gets passed as a JSON string, so here we parse it
        try data = JSON.parse fields.classified
        catch e
          response.status 400
          return response.json "bad JSON field(s)"

        console.log data
        # Extract the images. The will be set with the result from the uploader.
        imageMeta = data.new_images

        filesToDelete = data.filesToDelete or []
        data = Classifieds.filter data

        # Set the current user as the owner for this classified.
        data.owner = (request.user or {}).id

        # First create the classified
        Classifieds.get data.id, (error, classified) ->
          if error
            response.status 400
            return response.json error

          # Start saving the new files
          uploader.upload filesRequest["images[]"], (error, newImages=[]) ->
            if error
              response.status 400
              return response.json error

            # Now start processing a diff of the classified
            classifiedDiff = {}
            observableDiff classified.toJSON(), data, (diff) ->
              key = diff.path[0]
              # Don't edit any fields that are supposed to be 'final'
              if key in Classifieds.finalFields then return
              # For JSON fields, use JSON.stringify to save new results, or
              # else pg will throw an 'invalid json' error.
              if key in Classifieds.jsonFields
                # Avoid editing the images field
                if key is "images" then return
                classifiedDiff[key] = JSON.stringify data[key]
              # For all other fields, simply assign directly.
              else classifiedDiff[key] = data[key]

            # Here we remove the images that are in the server with the images
            # that have been flagged to be deleted.
            finalImages = []
            images = data.images or []
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
                      finalImages.push image
                    break

                # This file has been unchanged, so simply add it without any changes.
                if not found then finalImages.push image

            # The final set of images, will be the images after deletion and
            # the new set of images.
            classifiedDiff.images = JSON.stringify finalImages

            # Also a another step with the images is to assign the 'main image'
            # if it is not found already.
            ## TODO find main image

            # Finally update the classified with the diff into the DB.
            Classifieds.patch data.id, classifiedDiff, (error, classified) ->
              response.json classified.toJSON()

    # reCaptcha.verify request, captchaSuccess, captchaFail
    captchaSuccess()


exports["@require"] = [
  "models/classifieds"
  "controllers/recaptcha"
  "controllers/uploader"
]
exports["@singleton"] = true