validator     = require "validator"

exports = module.exports = (reCaptcha, email) ->
  controller = (request, response, next) ->
    id = request.params.id

    if not id?
      response.status 400
      response.json "classified id is required"

    captchaFail = ->
      response.status 401
      response.json "captcha failed"

    captchaSuccess = ->
      if not request.body
        response.status 400
        return response.json "missing email/message"

      email = request.body.email
      message = request.body.message

      # Perform some validation
      # TODO perform some XSS checks
      if not email?                       then status = "email is missing."
      else if not validator.isEmail email then status = "bad email"
      else if not message?                then status = "message is missing"
      else if message.length < 10         then status = "message is too short"
      else if 2000 < message.length       then status = "message is too long"
      if status?
        response.status 400
        return response.json status

      # Prepare the email's settings
      options =
        subject: "#{email} sent a message to your classified"
        email: email
        message: message
        classified: classified
        headers: "reply-to" : email

      # Send the email using the template
      email.sendTemplate classified.email, "classified-reply", options
      response.json "Message sent"

    reCaptcha.verify request, captchaSuccess, captchaFail


exports["@require"] = ["controllers/recaptcha"]
exports["@singleton"] = true