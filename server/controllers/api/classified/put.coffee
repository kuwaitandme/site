formidable = require 'formidable'

module.exports = (request, response, next) ->
  Classified = global.models.classified
  File = global.helpers.file
  response.contentType 'application/json'

  captchaFail = ->
    response.status 401
    response.end '"captcha failed"'

  captchaSuccess = ->
    # Initialize formidable
    form = new formidable.IncomingForm
    form.keepExtensions = true
    form.multiples = true
    form.maxFieldsSize = 10 * 1024 * 1024 # 2MB

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
          # Send a 400 Bad Request to the client
          if error
            File.delete files
            response.status 400
            return response.end JSON.stringify error

          # # Send classified-online email
          # toAddress = (classified.contact or {}).email || (request.user or {}).email
          # Email = global.controllers.helpers.email
          # Email.sendTemplate toAddress, 'classified-online',
          #   subject: "Your classified is now online!"
          #   classified: classified

          # If a classified was updated, then return it to the client.
          # The returned classified will contain the id parameter which
          # gets set by the database
          if classified then return response.end JSON.stringify classified

  reCaptcha = global.helpers.reCaptcha
  reCaptcha.verify request, captchaSuccess, captchaFail