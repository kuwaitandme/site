formidable = require 'formidable'

exports = module.exports = (Classified, reCaptcha, uploader) ->
  controller = (request, response, next) ->
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

        data = JSON.parse fields.classified
        files = filesRequest['images[]']
        data.slug = data.title.toLowerCase().replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-')
        data.status = 0

        uploader.upload files, (error, files) ->
          if error
            response.status 400
            return response.end JSON.stringify error

          data.images = files
          classified = new Classified data
          classified.save().then (model) ->
            response.end JSON.stringify model.toJSON()

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
  "models/classified"
  "controllers/recaptcha"
  "controllers/uploader"
]
exports["@singleton"] = true