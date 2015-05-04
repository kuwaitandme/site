module.exports = (Users) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    id = request.params.id

    # If no id was set, get the current user instance
    if not id?
      user = request.user

      # If there was a logged in user, then return with some fields blanked out
      if user
        user.activationToken = ""
        user.authHash = ""
        user.password = ""
        response.end JSON.stringify user

      # Else return a 404 Not found
      else response.end "{}"

    # An id was set, so query the DB for the user with that id
    else
      Users.findOne { id: id }, (err, user) ->
        if not user then response.end "{}"
        else
          user.activationToken = ""
          user.authHash = ""
          user.password = ""
          response.end JSON.stringify user

exports["@require"] = ["models/users"]
exports["@singleton"] = true