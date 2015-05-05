passport = require "passport"

# Controller for the login page. Attempts to log the user in.
#
# TODO improve error handling here
exports = module.exports = (user) ->
  (request, response, next) ->
    # Modify the request by assigning the email from the URL as a POST data
    request.body.username = request.params.email

    finish = (error, user) ->
      if error
        response.status 400
        return response.json error

      request.logIn user, (error) ->
        if error then return next error
        response.json user

    (passport.authenticate "local", finish) request, response, next


exports["@require"] = ["models/users"]
exports["@singleton"] = true