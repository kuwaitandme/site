passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "facebook",
    successRedirect: "/account?_success=facebook_success"
    failureRedirect: "/auth?_error=facebook_fail"


exports["@singleton"] = true