formidable = require 'formidable'

module.exports = (request, response, next) ->
  Classified = global.models.classified
  File = global.helpers.file
  response.contentType 'application/json'

  id = request.params.id
  authHash = request.query.authHash

  console.log id, authHash
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
      if classified.owner is not request.user._id
        response.status 401
        return response.end '"not owner"'
      if classified.guest and classified.authHash is not authHash
        response.status 401
        return response.end '"not owner"'

      # Setup error handler. This function gets called whenever there is an
      # error while processing the form.
      form.on 'error', (error) ->
        response.status 400
        response.end JSON.stringify error

      # Start parsing the form
      form.parse request, (error, fields, filesRequest) ->
        if error then return next error

        data = JSON.parse fields.data

        files = filesRequest['files[]']
        filesToDelete = data.filesToDelete or []
        images = data.images
        File.delete data.filesToDelete
        images.splice (images.indexOf file), 1 for file in filesToDelete
        data.images = images

        File.upload files, (error, files=[]) ->

          if error
            response.status 400
            return response.end JSON.stringify error

          images = data.images or []
          images.push file for file in files
          data.images = images

          Classified.update data, request.user, (error, classified) ->
            # If error was set, then nothing was updated.
            if error
              File.delete files
              response.status 400
              return response.end JSON.stringify error

            # If a classified was updated, then return it to the client.
            # The returned classified will contain the id parameter which
            # gets set by the database
            if classified then return response.end JSON.stringify classified

  reCaptcha = global.helpers.reCaptcha
  reCaptcha.verify request, captchaSuccess, captchaFail