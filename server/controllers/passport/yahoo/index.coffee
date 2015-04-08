YahooStrategy = (require 'passport-yahoo-oauth').Strategy

module.exports = (passport) ->
  callback = (token, tokenSecret, profile, done) ->
    User = global.models.user
    # console.log profile
    User.auth.yahoo.findOrCreate profile, done

  options =
    consumerKey: config.social.yahoo.consumerKey
    consumerSecret: config.social.yahoo.consumerSecret
    callbackURL: "#{config.host}/api/auth/yahoo/callback"
  passport.use new YahooStrategy options, callback