validator     = require "validator"

# The patch method for this route is used to request a password reset token for
# the user with the given id
module.exports = (request, response, next) ->

  captchaFail = (error, res) ->
    response.status 401
    response.json "captcha failed"

  captchaSuccess = (error) ->
    email = request.param.email

    # Check if email is valid
    if not validator.isEmail email
      response.status 400
      response.json "bad email"

    # Generate the reset token and send the email
    User = global.models.user
    User.createResetToken email, (error, user) ->
      # Handle if there was some internal error
      if error
        response.status 500
        response.json error

      # handle if user was not found
      else if not user
        response.status 400
        response.json "user not found"

      # All good otherwise, send reset email
      else
        Email.sendTemplate "Reset your password", user.email, "passwdreset",
          user: user

        response.json "reset sent"

  # Check the captcha
  reCaptcha.verify request, captchaSuccess, captchaFail

    # Activate

    # failUrl = '/auth/login?error=activate_fail'
    # successUrl = '/auth/login?success=activate_success'

    # # Get the parameters
    # token = request.query.token
    # id = request.params.id

    # if token

    # # Clean out the parameters
    # if token.length != 24 or not validator.isMongoId id then return next()

    # # Try and activate the user
    # user = global.models.user
    # user.activate id, token, (error, success) ->
    #   if error then return response.redirect(failUrl)
    #   if success then return response.redirect(successUrl)

    #   # Show 404 if activation failed
    #   next()
