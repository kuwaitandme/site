passport = require "passport"

exports = module.exports = (settings) ->
  passport.authenticate "google",  scope: settings.google.scope


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true