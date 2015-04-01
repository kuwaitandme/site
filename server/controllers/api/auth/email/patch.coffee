validator     = require 'validator'

# The patch method for this route is used to request a password reset token for
# the user with the given id
module.exports = (request, response, next) ->

  captchaFail = (error, res) ->
    response.status 401
    response.end '"captcha failed"'

  captchaSuccess = (error) ->
    email = request.param.email

    # Check if email is valid
    if not validator.isEmail email
      response.status 400
      response.end '"bad email"'

    # Generate the reset token and send the email
    User = global.models.user
    User.createResetToken email, (error, user) ->
      # Handle if there was some internal error
      if error
        response.status 500
        response.end JSON.stringify error

      # handle if user was not found
      else if not user
        response.status 400
        response.end '"user not found"'

      # All good otherwise, send reset email
      else
        Email.sendTemplate user.email, 'passwdreset',
          subject: 'Reset your password'
          user: user

        response.end '"reset sent"'

  # Check the captcha
  reCaptcha.verify request, captchaSuccess, captchaFail