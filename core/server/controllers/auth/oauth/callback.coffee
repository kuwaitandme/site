passport = require "passport"

exports = module.exports = (settings, Events) ->
  controller = (request, response, next) ->
    fn = passport.authenticate request.params[0],
      failureRedirect: "/auth?_error=oauth_fail"
      successRedirect: "/account?_success=oauth_success"

    # TODO: Check for SQL injection
    Events.log request, "LOGIN", {provider: request.params[0]}
    fn request, response, next


exports["@require"] = [
  "igloo/settings"
  "models/logs"
]
exports["@singleton"] = true
