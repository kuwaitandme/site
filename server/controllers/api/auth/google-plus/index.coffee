passport = require 'passport'

module.exports =
  get: passport.authenticate 'google', scope: 'profile'

  getCallback: passport.authenticate 'google',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=google_failed'

  routes: (router, base) ->
    router.get     "#{base}/google-plus",          @get
    router.get     "#{base}/google-plus/callback", @getCallback