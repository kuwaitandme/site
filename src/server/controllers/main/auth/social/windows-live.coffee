passport = require "passport"

exports = module.exports = (settings) ->
  passport.authenticate "windowslive",  scope: settings.windowsLive.scope


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true