passport = require 'passport'

module.exports = auth =
  get: passport.authenticate 'google', scope: 'profile'

  callback: passport.authenticate 'google',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=google_failed'

  getCallback: (request, response, next) ->
    logger = global.modules.logger
    logger request, "user registered/login (GOOGLEPLUS)"# with id:#{user._id}"
    auth.callback request, response, next

  routes: (router, base) ->
    router.get     "#{base}/google-plus",          @get
    router.get     "#{base}/google-plus/callback", @getCallback