passport = require "passport"

exports = module.exports = (settings) ->
  controller = (request, response, next) ->
    fn = passport.authenticate request.params[0],
      failureRedirect: "/auth?_error=oauth_fail"
      successRedirect: "/account?_success=oauth_success"
    fn request, response, next


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true