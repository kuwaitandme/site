passport = require "passport"

# Controller for the Registering a user via email
exports = module.exports = (user) ->
  (request, response, next) ->
    finish = (error, user, errorcode) ->
      if error
        response.status errorcode or 400
        response.json error, null, 2
      else response.json user, null, 2

    (passport.authenticate "email-signup", finish) request, response, next

exports["@require"] = [ "models/users" ]
exports["@singleton"] = true