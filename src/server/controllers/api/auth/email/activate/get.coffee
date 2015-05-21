Promise   = require "bluebird"
validator = require "validator"


# The controller to activate the user. This function expects the user"s id to
# be passed as well as the activation token passed a GET variable.
#
# Redirect to 'activationSuccessRedirect' iff the activation was successful
exports = module.exports = (IoC, Users) ->
  logger = IoC.create "igloo/logger"


  activationSuccessRedirect = "/auth?_success=activate_success"
  activationFailRedirect = "/auth?_error=activate_fail"

  validateRequest = (request) ->
    # First check if the user id is valid
    id = request.params.id
    if not validator.isInt id then throw new Error "invalid user id"
    # Check if the token is valid too
    token = request.query.token
    if not token? and token.length > 1 then throw new Error "invalid token"
    [id, token]


  validateWithDB = (token, user) ->
    userJSON = user.toJSON()
    if not userJSON then throw new Error "user not found"
    if not userJSON.meta? or not userJSON.meta.activationToken?
      throw new Error "user doesn't have activation token"
    if userJSON.meta.activationToken is not token
      throw new Error "token mismatch"
    userJSON


  activateUser = (userJSON) ->
    delete userJSON.meta.activationToken
    patch = status: Users.statuses.ACTIVE, meta: userJSON.meta
    Users.patchPromise userJSON.id, patch


  controller = (request, response, next) ->
    Promise.resolve request
    .then validateRequest
    .spread (id, token) -> [token, Users.getPromise id]
    .spread validateWithDB
    .then activateUser
    .then -> response.redirect activationSuccessRedirect
    .catch (error) ->
      logger.error error.message
      response.redirect activationFailRedirect


exports["@require"] = [
  "$container"

  "models/users"
]
exports["@singleton"] = true