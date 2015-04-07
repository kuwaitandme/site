FacebookStrategy = (require 'passport-facebook').Strategy

module.exports = (passport) ->
  callback = (accessToken, refreshToken, profile, done) ->
    User = global.models.user
    User.auth.facebook.findOrCreate profile , (error, user) ->
      if error then return done error
      done null, user

  options =
    clientID: config.social.facebook.clientid
    clientSecret: config.social.facebook.secret
    callbackURL: "#{config.host}/api/auth/facebook/callback"
  passport.use new FacebookStrategy options, callback