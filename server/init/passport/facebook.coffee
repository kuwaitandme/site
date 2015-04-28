FacebookStrategy = (require 'passport-facebook').Strategy

module.exports = (settings, passport, user) ->
  callback = (accessToken, refreshToken, profile, done) ->
    user.auth.facebook.findOrCreate profile, done
  options =
    callbackURL:  "#{settings.url}/api/auth/facebook/callback"
    clientID:     settings.facebook.clientid
    clientSecret: settings.facebook.secret
  passport.use new FacebookStrategy options, callback