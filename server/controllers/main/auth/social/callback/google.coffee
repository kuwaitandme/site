passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "google",
    successRedirect: "/account"
    failureRedirect: "/auth/login?error=google_failed"


exports["@singleton"] = true