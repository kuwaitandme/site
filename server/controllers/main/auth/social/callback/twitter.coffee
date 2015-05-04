passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "twitter",
    successRedirect: "/account"
    failureRedirect: "/auth/login?error=twitter_failed"


exports["@singleton"] = true