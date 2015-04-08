emailStrategy      = require './email'
facebookStrategy   = require './facebook'
yahooStrategy      = require './yahoo'
googleplusStrategy = require './google-plus'
twitterStrategy    = require './twitter'
# Passport needs to be able to serialize and de-serialize users to support
# persistent login sessions. This function defines those functionalities.
module.exports = (passport) ->

  passport.serializeUser (user, done) -> done null, user._id

  passport.deserializeUser (id, done) ->
    User = global.models.user
    User.model.findById id, (err, user) -> done err, user

  # Setup up Passport strategies for the different auth mechanisms..
  emailStrategy passport
  facebookStrategy passport
  googleplusStrategy passport
  yahooStrategy passport
  twitterStrategy passport