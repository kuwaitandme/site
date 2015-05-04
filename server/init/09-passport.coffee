passport           = require "passport"

# yahooStrategy      = require "./passport/yahoo"
emailStrategy      = require "./passport/email"
facebookStrategy   = require "./passport/facebook"
googleplusStrategy = require "./passport/google-plus"
twitterStrategy    = require "./passport/twitter"

exports = module.exports = (IoC, settings, user) ->
  app     = this
  logger  = IoC.create "igloo/logger"

  app.use passport.initialize()
  app.use passport.session()

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

  logger.info "passport initialized"

exports["@require"] = [
  "$container"
  "igloo/settings"
  "models/users"
]
exports["@singleton"] = true