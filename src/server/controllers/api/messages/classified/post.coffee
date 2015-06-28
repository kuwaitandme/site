Promise       = require "bluebird"
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
      data = request.body
      data.to_user = classified.get "owner"
      delete data.id

      Promise.props
        classified: classified
        message: Messages.create data

    .then (promise) ->
      classified = promise.classified
      message = promise.message

      # Before we send the email, we need the classified owner's email. So we
      # query for the email first
      Users.getPromise message.get "to_user"
      .then (user) -> user.get "email"

      # Once we have the destination email, we then prepare to send the message.
      .then (destinationEmail) ->
        # Start creating the email
        emailSubject = "Reply to your classified \"#{classified.get 'title'}\""
        from_email = message.get "from_email"
        from_name = message.get "from_name"
        emailOptions = {}

        # Properly format the replyTo field
        if from_name then emailOptions.replyTo = "#{from_name} <#{from_email}>"
        else emailOptions.replyTo = from_email

        templateOptions =
          classified: classified.toJSON()
          message: message.toJSON()
          viewer: emailOptions.replyTo

        # Finally send the email
        Email.sendTemplate emailSubject, destinationEmail, "classified/message",
          templateOptions, emailOptions

      .then -> message
    .then (json) -> response.json json
    .catch (error) ->
      console.error error.stacks
      next (error.status = 400) and error

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

