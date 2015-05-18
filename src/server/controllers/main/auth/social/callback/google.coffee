passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "google",
    successRedirect: "/account?_success=google_success"
    failureRedirect: "/auth?_error=google_fail"


exports["@singleton"] = true