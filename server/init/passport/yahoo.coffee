YahooStrategy = (require "passport-yahoo-oauth").Strategy

module.exportsDisabled = (passport) ->
  callback = (token, tokenSecret, profile, done) ->
    User = global.models.user
    User.auth.yahoo.findOrCreate profile, (error, user) ->
      logger = global.modules.logger
      logger request, "user registered/login (YAHOO) with id:#{user._id}"
      done error, user

  options =
    consumerKey: config.social.yahoo.consumerKey
    consumerSecret: config.social.yahoo.consumerSecret
    callbackURL: "#{config.host}/api/auth/yahoo/callback"
  passport.use new YahooStrategy options, callback