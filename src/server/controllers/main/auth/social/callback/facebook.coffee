passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "facebook",
    successRedirect: "/account?_success=facebook_success"
    failureRedirect: "/auth/login?_error=facebook_failed"


exports["@singleton"] = true