module.exports = ->
  controller = (request, response, next) ->
    user = request.user

    # If there was a logged in user, then return with some fields blanked out
    if user?
      user.activationToken = ""
      user.authHash = ""
      user.password = ""
      response.json user
    else
      # response.status 404
      response.json {}

exports["@singleton"] = true