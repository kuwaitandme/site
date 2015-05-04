formidable = require 'formidable'

exports = module.exports = (Classified, reCaptcha, uploader) ->
  controller = (request, response, next) ->
    # Classified = global.models.classified
    Uploader = global.modules.uploader
    response.contentType 'application/json'

    id = request.params.id
    authHash = request.query.authHash
    user = request.user or {}

    captchaFail = ->
      response.status 401
      response.end '"captcha failed"'

    captchaSuccess = ->
      # Initialize formidable
      form = new formidable.IncomingForm
      form.keepExtensions = true
      form.multiples = true
      form.maxFieldsSize = 10 * 1024 * 1024 # 2MB

      Classified.get id, (error, classified) ->
        if classified.guest
          if classified.authHash is not authHash
            response.status 401
            return response.end '"not owner"'
        else if classified.owner is not user._id
          response.status 401
          return response.end '"not owner"'

        # Setup error handler. This function gets called whenever there is an
        # error while processing the form.
        form.on 'error', (error) ->
          response.status 400
          # return response.end JSON.stringify error

        # Start parsing the form
        form.parse request, (error, fields, filesRequest) ->
          if error then return next error

          data = JSON.parse fields.data

          files = filesRequest["files[]"]
          filesToDelete = data.filesToDelete or []
          images = data.images
          Uploader.delete data.filesToDelete
          images.splice (images.indexOf file), 1 for file in filesToDelete
          data.images = images

          Uploader.upload files, (error, files=[]) ->

            if error
              response.status 400
              return response.end JSON.stringify error

            images = data.images or []
            images.push file for file in files
            data.images = images.splice 0, 12

            Classified.update data, request.user, (error, classified) ->
              # If error was set, then nothing was updated.
              if error
                Uploader.delete files
                response.status 400
                return response.end JSON.stringify error

              userid = (request.user or {})._id or "anonymous"
              logger = global.modules.logger
              logger request, "#{userid} edited classified with id:#{classified._id}"

              # If a classified was updated, then return it to the client.
              # The returned classified will contain the id parameter which
              # gets set by the database
              if classified then return response.end JSON.stringify classified

    reCaptcha = global.modules.recaptcha
    reCaptcha.verify request, captchaSuccess, captchaFail

exports["@require"] = [
  "models/classified"
  "controllers/uploader"
  "controllers/recaptcha"
]
exports["@singleton"] = true