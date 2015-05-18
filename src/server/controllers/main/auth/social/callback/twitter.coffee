passport = require "passport"

exports = module.exports = (renderer) ->
  passport.authenticate "twitter",
    successRedirect: "/account"
    failureRedirect: "/auth?error=twitter_fail"


exports["@singleton"] = true