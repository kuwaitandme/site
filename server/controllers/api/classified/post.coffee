formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

exports = module.exports = (Classified, reCaptcha, uploader) ->
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

        imageMeta = data.new_images
        delete data.new_images
        delete data.filesToDelete

        # First create the classified
        Classified.create data, (error, classified) ->
          if error
            response.status 400
            return response.json error

          # Start saving the files
          uploader.upload filesRequest["images[]"], imageMeta, (error, files) ->
            if error
              response.status 400
              return response.json error

            classified.set "slug", _createURLslug classified.toJSON()
            classified.set "images", JSON.stringify files

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