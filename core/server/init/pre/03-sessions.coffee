passport              = require "passport"
session               = require "express-session"
cookieParser          = require "cookie-parser"
randomstring          = require "randomstring-extended"
connectLiveReload     = require "connect-livereload"
validator             = require "validator"
_                     = require "underscore"

AmazonStrategy        = (require "passport-amazon").Strategy
FacebookStrategy      = (require "passport-facebook").Strategy
GoogleStrategy        = (require "passport-google-oauth").OAuth2Strategy
LinkedinStrategy      = (require "passport-linkedin").Strategy
LocalStrategy         = (require "passport-local").Strategy
RedditStrategy        = (require "passport-reddit").Strategy
TwitterStrategy       = (require "passport-twitter").Strategy
WindowsStrategy       = (require "passport-windowslive").Strategy
WordpressStrategy     = (require "passport-wordpress").Strategy
OpenIDStrategy        = (require "passport-openid").Strategy


exports = module.exports = (IoC, settings, sessions, Logs, Users) ->
  app = this
  logger = IoC.create "igloo/logger"
  name = "[session]"


  # Add cookie parsing support
  app.use cookieParser settings.cookieParser


  # add request.session cookie support, and use Redis for storage
  settings.session.store = sessions
  app.sessionInstance = session settings.session
  app.use app.sessionInstance


  # Initialize passport
  app.use passport.initialize()
  app.use passport.session()


  # Email Authentication
  passport.use new LocalStrategy (username, password, done) ->
    # First query the DB for the user.
    Users.findByUsernameOrEmail username
    .then (user) ->
      # Check if the user exists
      if not user? then throw new Error "bad username/email"

      # Check if password is valid
      if not Users.isPasswordValid password, user.get "password"
        throw new Error "password mismatch"

      # # Check if account is active or not.
      # if not Users.isActive user
      #   # if json.meta and not json.meta.hasTemporaryPassword
      #   return throw new Error "not allowed to login"

      # Login successful!
      done null, user
    .catch (error) -> done error.message


  # Add passport serialization/de-serialization
  passport.deserializeUser (id, callback) -> Users.deserialize id, callback
  passport.serializeUser (user, callback) -> Users.serialize user, callback


exports["@require"] = [
  "$container"
  "igloo/settings"
  "igloo/sessions"

  "models/logs"
  "models/users"
]