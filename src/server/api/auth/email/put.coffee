passport = require "passport"

# Controller for the Registering a user via email
exports = module.exports = (user) ->
  (request, response, next) ->

    finish = (error, user, errorcode) ->
      if error
        response.status errorcode or 400
        response.json error
      else response.json user

    (passport.authenticate "email-signup", finish) request, response, next

exports["@require"] = ["models/users"]
exports["@singleton"] = true

# validator = require "validator"

# # This controller attempts to reset the password for the given user. It expects
# # the user's id to part of the url and the reset token to be passed as a GET
# # variable. It also expects the new password (along with the re-entered password)
# # to be passed as data variables in the request.
# #
# # It returns HTTP 200 iff the password reset was successful.
# exports = module.exports = (user) ->
#   (request, response, next) ->
#   id = request.params.id
#   resetToken = request.query.resetToken or ''

#   captchaFail = (err, res) ->
#     response.status 401
#     response.end '"captcha failed"'

#   captchaSuccess = (err) ->
#     password = request.body.password
#     repassword = request.body.repassword

#     # Clean out the parameters
#     if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
#       response.status 400
#       return response.end 'bad_token'

#     # Check if passwords match
#     if password is not repassword
#       response.status 400
#       return response.end 'password_mismatch'

#     # Check if password is too small
#     if password.length < 5
#       response.status 400
#       return response.end 'password_small'

#     # All good, so attempt to reset the password
#     User = global.models.user
#     User.resetPassword id, resetToken, password, (err, success) ->
#       if err then throw err
#       if not success
#         response.status 400
#         return response.end 'reset_fail'

#       return response.end "success"


#   # Check the captcha, which then calls the function to reset the password
#   reCaptcha.verify request, captchaSuccess, captchaFail

# module.exports = (request, response, next) ->
#   response.contentType "application/json"

#   # First check if the user id is valid
#   if not validator.isMongoId id
#     response.status 400
#     return response.end '"invalid user id"'

#   if request.query.resetToken then reset request, response, next
#   else
#     response.end '"unknown method"'