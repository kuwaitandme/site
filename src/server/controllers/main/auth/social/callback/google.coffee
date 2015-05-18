passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "google",
    successRedirect: "/account?_success=google_success"
    failureRedirect: "/auth/login?_error=google_failed"


exports["@singleton"] = true