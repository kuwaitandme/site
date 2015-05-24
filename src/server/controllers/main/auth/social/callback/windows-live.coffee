passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "windowslive",
    successRedirect: "/account?_success=social_success"
    failureRedirect: "/auth?_error=social_fail"


exports["@singleton"] = true