passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "google",
    successRedirect: "/accoun?_success=google_successt"
    failureRedirect: "/auth/login?_error=google_failed"


exports["@singleton"] = true