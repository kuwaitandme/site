formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

exports = module.exports = (Classifieds, reCaptcha, uploader) ->
  _createURLslug = (classified) ->
    maxLength = 70
    # Get the keywords and make a sentence seperated by '-'s.
    keywords = keyword_extractor.extract classified.title,
      language: "english"
      remove_duplicates: true
      return_changed_case: true
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


  controller = (request, response, next) ->
    captchaFail = ->
      response.status 401
      response.end "captcha failed"

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

        # Extract the images. The will be set with the result from the uploader.
        images = data.images
        data = Classifieds.filter data
        delete data.images

        # Set the current user as the owner for this classified.
        data.owner = (request.user or {}).id

        # First create the classified
        Classifieds.create data, (error, classified) ->
          if error
            response.status 400
            return response.json error

          # Start saving the files
          uploader.upload filesRequest["images[]"], (error, newImages) ->
            if error
              response.status 400
              return response.json error

            # For every new image, if it was uploaded find it metadata and attach
            # it to the list of final images
            finalImages = []
            for newImage in newImages
              for image in images
                if newImage.oldFilename is image.filename and newImage.isUploaded
                  image.filename = newImage.newFilename
                  finalImages.push image

            # Get the slug for the classified using the newly generated id and
            # set the images field with our final set of images.
            classified.set "slug", _createURLslug classified.toJSON()
            classified.set "images", JSON.stringify finalImages

            # Update the classified with the images and return
            classified.save().then (classified) ->
              response.json classified.toJSON()

    # reCaptcha.verify request, captchaSuccess, captchaFail
    captchaSuccess()


exports["@require"] = [
  "models/classifieds"
  "controllers/recaptcha"
  "controllers/uploader"
]
exports["@singleton"] = true