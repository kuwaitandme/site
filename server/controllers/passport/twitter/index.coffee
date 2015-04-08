twitterStrategy = (require 'passport-twitter').Strategy

module.exports = (passport) ->
  callback = (accessToken, refreshToken, profile, done) ->
    User = global.models.user
    console.log profile
    done 's'
    # User.auth.twitter.findOrCreate profile, done

  options =
    consumerKey: config.social.twitter.consumerKey
    consumerSecret: config.social.twitter.consumerSecret
    callbackURL: "#{config.host}/api/auth/twitter/callback"
  console.log options
  passport.use new twitterStrategy options, callback