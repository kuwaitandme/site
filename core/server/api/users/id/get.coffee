exports = module.exports = (Users) ->
  routes: ["/users/([0-9]+)"]
  controller: (request, response, next) ->
    Users.get(request.params[0]).then (user) ->
      user = user.toJSON()
      delete user.password
      delete user.credits
      response.json user


exports["@require"] = ["models/users"]
exports["@singleton"] = true