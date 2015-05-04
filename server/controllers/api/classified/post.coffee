formidable        = require "formidable"
keyword_extractor = require "keyword-extractor"

_generateURLslug = (classified) ->
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


exports = module.exports = (Classified, reCaptcha, uploader) ->
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

        data = JSON.parse fields.classified
        files = filesRequest["images[]"]
        data.slug = ""
        data.status = 0

        uploader.upload files, (error, files) ->
          if error
            response.status 400
            return response.json error

          data.images = files
          Classified.create data, (error, classified) ->
            # Generate the slug (which is based on the 'id')
            classified.slug = _generateURLslug classified

            # Update the classified with the new slug and return
            classified.save().then (classified) ->
              response.json classified.toJSON()

          # new Post({name: 'New Article'}).save().then(function(model) {
#   // ...
# });
          # Classified.create data, request.user, (error, classified) ->
          #   # If error was set, then nothing was saved. Send a 400 Bad Request to
          #   # the client
          #   if error
          #     uploader.delete files
          #     response.status 400
          #     return response.end JSON.stringify error

          #   userid = (request.user or {})._id or "anonymous"
          #   # logger = global.modules.logger
          #   # logger request, "#{userid} created classified with id:#{classified._id}"

          #   # Send 'classified is online' email
          #   toAddress = (request.user or {}).email or (classified.contact or {}).email
          #   # if toAddress
          #   #   Email = global.modules.email
          #   #   Email.sendTemplate toAddress, 'classified-online',
          #   #     subject: "Your classified is now online!"
          #   #     classified: classified

          #   # If a classified was saved, then return it to the client.
          #   # The returned classified will contain the id parameter which
          #   # gets set by the database
          #   if classified then return response.end JSON.stringify classified

    # reCaptcha.verify request, captchaSuccess, captchaFail
    captchaSuccess()


exports["@require"] = [
  "models/classifieds"
  "controllers/recaptcha"
  "controllers/uploader"
]
exports["@singleton"] = true