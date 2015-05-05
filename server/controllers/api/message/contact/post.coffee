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
        return response.json "Missing email/message"

      email = request.body.email
      message = request.body.message

      if not email?
        response.status 400
        return response.json "email is missing."

      if not validator.isEmail email
        response.status 400
        return response.json "bad email"

      if not message?
        response.status 400
        return response.json "message is missing"

      if message.length < 10
        response.status 400
        return response.json "message is too short"

      if 2000 < message.length
        response.status 400
        return response.json "message is too long"

      email.send "Message from #{email}", message, "stevent95@gmail.com", message
      response.json "Message sent"


    reCaptcha.verify request, captchaSuccess, captchaFail


exports["@require"] = ["controllers/recaptcha"]
exports["@singleton"] = true