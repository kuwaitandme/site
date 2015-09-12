exports = module.exports = (Users) ->
  middleware = (request, response, next) ->
    if !request.user then next()
    else if Users.isActive request.user then next()
    else next new NotPrivelegedError


exports["@singleton"] = true
exports["@require"] = ["models/users"]