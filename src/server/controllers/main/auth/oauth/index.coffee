passport = require "passport"

###*
 * This controller is responsible for authenticating the user with the
 * different OAuth mechanisms installed into the app.
 *
 * It dynamically runs for any oauth provider and carefully handles any possible
 * error (such as giving a 404 for an non-existent oauth method.)
 *
 * @param String provider     The oauth provider with which we must authenticate
 *                            with. (Must be initialized with passport).
 *
 * @example
 * GET sitename.tld/auth/oauth/facebook     -> 302 facebook.com/oauth/....
 * GET sitename.tld/auth/oauth/fakenetwork  -> 404
 *
 * @author Steven Enamakel <me@steven.pw>
###
exports = module.exports = (settings) ->
  controller = (request, response, next) ->
    provider = request.params[0]
    if not provider? then return next()

    try
      # First try and find in the settings, if any scope was attached for this
      # provider
      try scope = settings[provider].scope
      catch e

      # If there was a scope mentioned, then initialize passport with it.
      if scope? then fn = passport.authenticate provider, scope: scope
      else fn = passport.authenticate provider

      # If there was no function defined, then return 404
      if not fn? then return next()
      # Else execute the function passing on request, response and next...
      else fn request, response, next

    # For any error, that happen while initializing passport, give a 404 error
    catch e then next()


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true
