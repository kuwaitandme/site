validator = require 'validator'


# The controller to activate the user. This function expects the user's id to
# be passed as well as the activation token passed a GET variable.
#
# It returns HTTP 200 iff the activation was successful.
activate = (request, response, next) ->
  # Get the parameters
  token = request.query.activateToken
  id = request.params.id

  # Clean out the parameters
  if token.length != 24 or !/^[0-9A-F]*$/i.test(id)
    response.status 400
    return response.end '"bad prameters"'

  # Try and activate the user
  User = global.models.user
  User.activate id, token, (error, success) ->
    if error
      response.status 500
      return response.end JSON.stringify error

    if success then response.end '"success"'
    else
      response.status 401
      response.end '"activation failed"'

# This controller attempts to reset the password for the given user. It expects
# the user's id to part of the url and the reset token to be passed as a GET
# variable. It also expects the new password (along with the re-entered password)
# to be passed as data variables in the request.
#
# It returns HTTP 200 iff the password reset was successful.
reset = (request, response, next) ->
  id = request.params.id
  resetToken = request.query.resetToken or ''

  captchaFail = (err, res) ->
    response.status 401
    response.end '"captcha failed"'

  captchaSuccess = (err) ->
    password = request.body.password
    repassword = request.body.repassword

    # Clean out the parameters
    if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
      response.status 400
      return response.end 'bad_token'

    # Check if passwords match
    if password is not repassword
      response.status 400
      return response.end 'password_mismatch'

    # Check if password is too small
    if password.length < 5
      response.status 400
      return response.end 'password_small'

    # All good, so attempt to reset the password
    User = global.models.user
    User.resetPassword id, resetToken, password, (err, success) ->
      if err then throw err
      if not success
        response.status 400
        return response.end 'reset_fail'

      return response.end 'success'


  # Check the captcha, which then calls the function to reset the password
  reCaptcha.verify request, captchaSuccess, captchaFail


module.exports = (request, response, next) ->
  response.contentType 'application/json'

  # First check if the user id is valid
  if not validator.isMongoId id
    response.status 400
    return response.end '"invalid user id"'

  if request.query.resetToken then reset request, response, next
  else if request.query.activateToken then activate request, response, next
  else
    # response.status 123
    response.end '"unknown method"'