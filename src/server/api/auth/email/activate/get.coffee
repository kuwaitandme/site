Promise   = require "bluebird"
validator = require "validator"


# The controller to activate the user. This function expects the user"s id to
# be passed as well as the activation token passed a GET variable.
#
# Redirect to 'activationSuccessRedirect' iff the activation was successful
exports = module.exports = (IoC, Users) ->
  logger = IoC.create "igloo/logger"

  activationSuccessRedirect = "/?_success=activate_success"
  activationFailRedirect = "/?_error=activate_fail"

  # First check if the request contains all the necessary parameters
  validateRequest = (request) ->
    id = request.params[0]
    token = request.query.token
    if not validator.isInt id then throw new Error "invalid user id"
    if not token? and token.length > 1 then throw new Error "invalid token"
    [id, token]


  # Then once the user is fetched from the DB, check if the token validates
  # properly with the user.
  validateWithDB = (token, user) ->
    userJSON = user.toJSON()
    if not userJSON then throw new Error "user not found"
    if not userJSON.meta? or not userJSON.meta.activationToken?
      throw new Error "user doesn't have activation token"
    if userJSON.meta.activationToken is not token
      throw new Error "token mismatch"
    userJSON


  # All validation went well. Ok, so now we update the user with a new 'active'
  # status and the activation token removed.
  activateUser = (userJSON) ->
    delete userJSON.meta.activationToken
    patch = status: Users.statuses.ACTIVE, meta: userJSON.meta
    Users.patch userJSON.id, patch


  controller = (request, response, next) ->
    # Promisify the request, to start the promise chain
    Promise.resolve request
    # Validate the request
    .then validateRequest
    # Get the user (but redirect the output to nice array format)
    .spread (id, token) -> [token, Users.get id]
    # Validate the request with the user from the DB
    .spread validateWithDB
    # Activate the user!
    .then activateUser
    # Redirect to the login page
    .then -> response.redirect activationSuccessRedirect
    .catch (error) ->
      logger.error error.message
      response.redirect activationFailRedirect


exports["@require"] = [
  "$container"

  "models/users"
]
exports["@singleton"] = true
