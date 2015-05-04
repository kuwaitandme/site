passport = require "passport"

# Controller for the Registering a user via email
exports = module.exports = (user) ->
  (request, response, next) ->
    response.contentType "application/json"

    finish = (error, user, errorcode) ->
      if error
        response.status errorcode or 400
        response.end JSON.stringify error, null, 2
      else response.end JSON.stringify user, null, 2

    (passport.authenticate "email-signup", finish) request, response, next

exports["@require"] = [ "models/users" ]
exports["@singleton"] = true