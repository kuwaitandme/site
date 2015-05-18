passport = require "passport"


exports = module.exports = (settings) ->
  passport.authenticate "facebook", scope: settings.facebook.scope


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true