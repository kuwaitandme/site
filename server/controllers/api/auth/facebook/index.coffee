passport = require 'passport'

module.exports =
  # Redirect the user to Facebook for authentication.  When complete,
  # Facebook will redirect the user back to the application at
  #     /auth/facebook/callback
  get: passport.authenticate 'facebook'

  # Facebook will redirect the user to this URL after approval.  Finish the
  # authentication process by attempting to obtain an access token.  If
  # access was granted, the user will be logged in.  Otherwise,
  # authentication has failed.
  getCallback: passport.authenticate 'facebook',
    successRedirect: '/account'
    failureRedirect: '/auth/login?error=facebook_failed'

  routes: (router, base) ->
    router.get     "#{base}/facebook",          @get
    router.get     "#{base}/facebook/callback", @getCallback