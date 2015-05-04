validator = require "validator"

# The controller to activate the user. This function expects the user"s id to
# be passed as well as the activation token passed a GET variable.
#
# It returns HTTP 200 iff the activation was successful.
exports = module.exports = (IoC, user) ->
  (request, response, next) ->
    response.contentType "application/json"
    id = request.params.id

    # First check if the user id is valid
    if not validator.isMongoId id
      response.status 400
      return response.end "'invalid user id'"

    # Get the parameters
    token = request.query.token or ""
    id = request.params.id

    # Clean out the parameters
    if token.length != 24 or !/^[0-9A-F]*$/i.test id
      return response.redirect "/auth/login?success=activate_fail"

    # Try and activate the user
    user.activate id, token, (error, success) ->
      if error or not success then response.redirect "/auth/login?success=activate_fail"
      else response.redirect "/auth/login?success=activate_success"

exports["@require"] = [ "models/users" ]
exports["@singleton"] = true