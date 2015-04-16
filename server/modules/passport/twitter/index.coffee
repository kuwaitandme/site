twitterStrategy = (require 'passport-twitter').Strategy

module.exports = (passport) ->
  callback = (token, tokenSecret, profile, done) ->
    User = global.models.user
    User.auth.twitter.findOrCreate profile, done

  options =
    consumerKey: config.social.twitter.consumerKey
    consumerSecret: config.social.twitter.consumerSecret
    callbackURL: "#{config.host}/api/auth/twitter/callback"
  passport.use new twitterStrategy options, callback