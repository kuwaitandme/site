passport = require "passport"

exports = module.exports = (settings) ->
  controller = (request, response, next) ->
    provider = request.params[0]
    if not provider? then return next()

    try scope = settings[provider].scope
    catch e

    if scope? then fn = passport.authenticate provider, scope: scope
    else fn = passport.authenticate provider

    if not fn? then return next()
    else fn request, response, next


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true