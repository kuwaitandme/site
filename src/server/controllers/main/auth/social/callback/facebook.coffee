passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "facebook",
    successRedirect: "/account"
    failureRedirect: "/auth/login?error=facebook_failed"


exports["@singleton"] = true