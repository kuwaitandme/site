exports = module.exports = (Users) ->
  controller = (request, response, next) ->
    id = request.params.id

    if not id?
      response.status 404
      response.json "you can't query on users without an id"

    else
      Users.get id, (error, user) ->
        if error
          response.status 500
          response.json error
        else if not user
          response.status 404
          response.json "user not found"
        else
          # Convert the user to JSON so that we can start removing sensitive
          # fields.
          user = user.toJSON()
          delete user.credits
          delete user.password
          delete user.meta
          response.json user


exports["@require"] = ["models/users"]
exports["@singleton"] = true