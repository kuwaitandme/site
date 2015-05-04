FacebookStrategy = (require "passport-facebook").Strategy

module.exports = (settings, passport, User) ->
  callback = (accessToken, refreshToken, profile, done) ->
    User.auth.facebook.findOrCreate profile, done
  options =
    callbackURL:  "#{settings.url}/api/auth/facebook/callback"
    clientID:     settings.facebook.clientid
    clientSecret: settings.facebook.secret
  passport.use new FacebookStrategy options, callback