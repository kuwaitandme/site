passport = require 'passport'

module.exports = auth =
  get: passport.authenticate 'twitter'

  callback: passport.authenticate 'twitter',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=twitter_failed'

  getCallback: (request, response, next) ->
    logger = global.modules.logger
    logger request, "user registered/login (TWITTER)"# with id:#{user._id}"
    auth.callback request, response, next

  routes: (router, base) ->
    router.get     "#{base}/twitter",          @get
    router.get     "#{base}/twitter/callback", @getCallback