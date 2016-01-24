Controller = module.exports = (renderer, Users) ->
  controller = (request, response, next) ->
    Users.getByUsername(request.params[0]).then (user) ->
      if not user? then next()

      args =
        page: "info/about"
        title: response.__ "users/single:title"
        data: user.toJSON() or {}

      renderer request, response, args, true
    .catch (e) -> next e


# Controller["@routes"] = []
Controller["@require"] = [
  "models/users"
]
Controller["@singleton"] = true