passport = require 'passport'

module.exports =
  get: passport.authenticate 'twitter'

  getCallback: passport.authenticate 'twitter',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=twitter_failed'

  routes: (router, base) ->
    router.get     "#{base}/twitter",          @get
    router.get     "#{base}/twitter/callback", @getCallback