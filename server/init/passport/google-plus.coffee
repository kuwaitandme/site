GooglePlusStrategy = (require "passport-google-oauth").OAuth2Strategy

module.exports = (settings, passport, user) ->
  callback = (accessToken, refreshToken, profile, done) ->
    user.auth.googlePlus.findOrCreate profile, done
  options =
    callbackURL:  "#{settings.url}/api/auth/google-plus/callback"
    clientID:     settings.googlePlus.clientId
    clientSecret: settings.googlePlus.clientSecret
  passport.use new GooglePlusStrategy options, callback