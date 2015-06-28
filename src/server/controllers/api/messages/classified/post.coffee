validator     = require "validator"

exports = module.exports = (reCaptcha, Email, Classifieds, Messages, Users) ->
  controller = (request, response, next) ->
    id = request.params[0]

    if not id? or not validator.isInt id
      response.status 400
      response.json "classified id is required"


    reCaptcha.verify request
    .then -> Classifieds.get id
    .then (classified) ->
      message = request.body
      message.to_user = classified.get "owner"
      delete message.id
      message
    .then -> request.body
    .then Messages.create
    .then (model) ->
      Users.getPromise model.get "to_user"
      .then (user) -> user.get "email"
      .then (email) -> Email.send "hello", email, model.get "message"
      .then -> model
    .then (json) -> response.json json
    .catch (e) ->
      console.log e
      console.log e.stack
      next
    # captchaFail = ->
    #   response.status 401
    #   response.json "captcha failed"

    # captchaSuccess = ->
    #   if not request.body
    #     response.status 400
    #     return response.json "missing email/message"

    #   email = request.body.email
    #   message = request.body.message

    #   # Perform some validation
    #   # TODO perform some XSS checks
    #   if not email?                       then status = "email is missing."
    #   else if not validator.isEmail email then status = "bad email"
    #   else if not message?                then status = "message is missing"
    #   else if message.length < 10         then status = "message is too short"
    #   else if 2000 < message.length       then status = "message is too long"
    #   if status?
    #     response.status 400
    #     return response.json status

    #   # Prepare the email's settings
    #   options =
    #     subject: "#{email} sent a message to your classified"
    #     email: email
    #     message: message
    #     classified: classified
    #     headers: "reply-to" : email

    #   # Send the email using the template
    #   email.sendTemplate classified.email, "classified-reply", options
    #   response.json "Message sent"

    # reCaptcha.verify request, captchaSuccess, captchaFail


exports["@require"] = [
  "controllers/recaptcha"
  "controllers/email"
  "models/classifieds"
  "models/messages"
  "models/users"
]
exports["@singleton"] = true

