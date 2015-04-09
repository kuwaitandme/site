GooglePlusStrategy = (require 'passport-google-oauth').OAuth2Strategy

module.exports = (passport) ->
  callback = (accessToken, refreshToken, profile, done) ->
    User = global.models.user
    User.auth.googlePlus.findOrCreate profile, done

  options =
    clientID: config.social.googlePlus.clientId
    clientSecret: config.social.googlePlus.clientSecret
    callbackURL: "#{config.host}/api/auth/google-plus/callback"
  passport.use new GooglePlusStrategy options, callback