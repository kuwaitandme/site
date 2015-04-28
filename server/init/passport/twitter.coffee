twitterStrategy = (require 'passport-twitter').Strategy

module.exports = (settings, passport, user) ->
  callback = (token, tokenSecret, profile, done) ->
    user.auth.twitter.findOrCreate profile, done
  options =
    callbackURL:    "#{settings.url}/api/auth/twitter/callback"
    consumerKey:    settings.twitter.consumerKey
    consumerSecret: settings.twitter.consumerSecret
  passport.use new twitterStrategy options, callback