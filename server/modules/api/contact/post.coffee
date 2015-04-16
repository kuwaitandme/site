validator     = require 'validator'

module.exports = (request, response, next) ->
  response.contentType 'application/json'

  captchaFail = ->
    response.status 401
    response.end '"captcha failed"'

  captchaSuccess = ->
    if not request.body
      response.status 400
      return response.end '"Missing email/message"'

    email = request.body.email
    message = request.body.message

    if not email and email.length > 0
      response.status 400
      return response.end '"Email is missing. "'
    if not validator.isEmail email
      response.status 400
      return response.end '"Bad email. please give a valid email"'
    if not message and message.length > 0
      response.status 400
      return response.end '"Message is missing"'

    Email = global.modules.email
    Email.send "Message from #{email}", message, 'stevent95@gmail.com', message

  response.end '"Message sent"'
  reCaptcha = global.modules.recaptcha
  reCaptcha.verify request, captchaSuccess, captchaFail