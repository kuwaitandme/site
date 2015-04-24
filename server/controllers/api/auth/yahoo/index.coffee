passport = require 'passport'

module.exports =
  get: passport.authenticate 'yahoo'

  getCallback: passport.authenticate 'yahoo',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=yahoo_failed'

  routes: (router, base) ->
    router.get     "#{base}/yahoo",          @get
    router.get     "#{base}/yahoo/callback", @getCallback