validator = require "validator"

# The controller to activate the user. This function expects the user"s id to
# be passed as well as the activation token passed a GET variable.
#
# It returns HTTP 200 iff the activation was successful.
exports = module.exports = (Users) ->
  (request, response, next) ->
    id = request.params.id

    # First check if the user id is valid
    if not validator.isInt id
      response.status 400
      return response.json "invalid user id"

    # Get the parameters
    token = request.query.token or ""
    id = request.params.id

    # Try and activate the user
    Users.get id, (error, user) ->
      user = user.toJSON()
      if error or not user or not user.meta? or
      user.meta.activationToken is not token
        response.redirect "/auth/?notify_fail=activate_fail"
      else
        patch =
          status: Users.statuses.ACTIVE
          meta: {}
        Users.patch id, patch, (error, user) ->
          response.redirect "/auth/?notify_success=activate_success"


exports["@require"] = ["models/users"]
exports["@singleton"] = true