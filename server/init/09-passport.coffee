passport           = require 'passport'

emailStrategy      = require './passport/email'
facebookStrategy   = require './passport/facebook'
yahooStrategy      = require './passport/yahoo'
googleplusStrategy = require './passport/google-plus'
twitterStrategy    = require './passport/twitter'

exports = module.exports = (settings, user) ->
  app = this
  app.use passport.initialize()
  app.use passport.session()

  console.log 'sdf1', user
  # Passport needs to be able to serialize and de-serialize users to support
  # persistent login sessions. This function defines those functionalities.
  passport.serializeUser (result, done) -> done null, result._id
  passport.deserializeUser (id, done) ->
    user.model.findById id, (err, result) -> done err, result

  # Setup up Passport strategies for the different auth mechanisms..
  emailStrategy       settings, passport, user
  facebookStrategy    settings, passport, user
  googleplusStrategy  settings, passport, user
  twitterStrategy     settings, passport, user
  # yahooStrategy       settings, passport, user

exports['@require'] = [
  'igloo/settings'
  'models/user'
]
exports['@singleton'] = true