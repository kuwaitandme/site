# Promise   = require "bluebird"
# validator = require "validator"

# modifySuccessRedirect = "/auth?_success=account_changes_saved"
# modifyFailRedirect = "/auth?_error=account_changes_failed"

# # (untested)
# exports = module.exports = (IoC, Users) ->
#   logger = IoC.create "igloo/logger"


#   # First check if the request contains all the necessary parameters
#   validateRequest = (request) ->
#     id = request.params[0]
#     token = request.query.token
#     if not validator.isInt id then throw new Error "invalid user id"
#     if not token? and token.length > 1 then throw new Error "invalid token"
#     [id, token]


#   # Then once the user is fetched from the DB, check if the token validates
#   # properly with the user.
#   validateWithDB = (token, user) ->
#     userJSON = user.toJSON()
#     if not userJSON then throw new Error "user not found"
#     if not userJSON.meta? throw new Error "user didn't request for change"
#     if not userJSON.meta.signupVerifyToken?
#       throw new Error "user doesn't have verification token"
#     if not userJSON.meta.newPassword?
#       throw new Error "user doesn't have replacement password"
#     if not userJSON.meta.newName?
#       throw new Error "user doesn't have replacement name"
#     if userJSON.meta.signupVerifyToken is not token
#       throw new Error "token mismatch"
#     userJSON


#   # All validation went well. Ok, so now we update the user with a new 'active'
#   # status and the activation token removed.
#   updateUser = (userJSON) ->
#     patch =
#       full_name: userJSON.meta.newName
#       password: userJSON.meta.newPassword

#     # Remove the meta fields to create the new meta object that will get patched
#     # along with the fullname and password.
#     delete userJSON.meta.signupVerifyToken
#     delete userJSON.meta.newName
#     delete userJSON.meta.newPassword
#     patch.meta = userJSON.meta
#     Users.patch userJSON.id, patch


#   controller = (request, response, next) ->
#     # Promisify the request, to start the promise chain
#     Promise.resolve request
#     # Validate the request
#     .then validateRequest
#     # Get the user (but redirect the output to nice array format)
#     .spread (id, token) -> [token, Users.get id]
#     # Validate the request with the user from the DB
#     .spread validateWithDB
#     # Update the user!
#     .then updateUser
#     # Redirect to the login page
#     .then -> response.redirect modifySuccessRedirect
#     .catch (error) ->
#       logger.error error.message
#       response.redirect modifyFailRedirect


# exports["@require"] = [
#   "$container"

#   "models/users"
# ]
# exports["@singleton"] = true
