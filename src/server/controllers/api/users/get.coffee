exports = module.exports = (Users) ->
  controller = (request, response, next) ->
    id = request.params[0]

    if not id? then
      response.status 404
      response.json "need id"

    else
      Users.getPromise id
      .then (user) ->
        if not user
          response.status 404
          response.json "user not found"
        else
          # Convert the user to JSON so that we can start removing sensitive
          # fields.
          user = user.toJSON()
          delete user.password
          delete user.meta
          response.json user
      .catch next


exports["@require"] = ["models/users"]
exports["@singleton"] = true
