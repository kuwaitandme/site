passport = require "passport"

# Controller for the login page. Attempts to log the user in.
#
# TODO improve error handling here
exports = module.exports = (Events) ->
  (request, response, next) ->
    finish = (error, user) ->
      if error or not user
        response.status 400
        return response.json error
      request.logIn user, (error) ->
        if error then return next error
        Events.log request, "LOGIN", provider: "email"
        response.json user

    (passport.authenticate "local", finish) request, response, next


exports["@require"] = ["models/events"]
exports["@singleton"] = true
