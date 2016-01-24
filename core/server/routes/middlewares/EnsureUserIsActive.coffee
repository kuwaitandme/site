exports = module.exports = (Users, UserInactiveError) ->
  middleware = (request, response, next) ->
    if not request.user then next()
    else if Users.isActive request.user then next()
    else next new UserInactiveError


exports["@singleton"] = true
exports["@require"] = ["models/users"]