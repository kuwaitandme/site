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
      Users.get message.get "to_user"
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

      # Once the email is sent, we resolve the message from the modal.
      .then -> message

    # Return the JSON of the new message to the user
    .then (json) -> response.json json

    # All error to be masked as HTTP 400.
    .catch (error) -> next (error.status = 400) and error


exports["@require"] = [
  "controllers/recaptcha"
  "controllers/email"
  "models/classifieds"
  "models/messages"
  "models/users"
]
exports["@singleton"] = true

