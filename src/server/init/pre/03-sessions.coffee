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


exports = module.exports = (IoC, settings, sessions, Email, Logs,
Users) ->
  app = this
  logger = IoC.create "igloo/logger"
  name = "[session]"


  ###
    This function gets called for each of the OAuth logins. A uniform function
    that takes care of everything from DB....

    @param {[type]}   accessToken  [description]
    @param {[type]}   refreshToken [description]
    @param {[type]}   profile      [description]
    @param {Function} done         [description]
    @return {[type]}                [description]
  ###
  providerAuthCallback = (accessToken, refreshToken, profile, done) ->
    logger.debug name, "got profile from OAuth:", profile.provider
    if profile.emails.length == 0 or (not _.isObject profile.emails[0]) or
    not validator.isEmail profile.emails[0].value
      return done new Error "no oauth email found"

    # Query for the user based on the provider.
    Users.findOne email: profile.emails[0].value
    .then (user) ->
      if not user? then throw new Error "not found"

      # User exists, check if the provider's details have been set and return
      # the user back to passport.
      json = user.toJSON()

      # Start checking the login providers.
      if json.login_providers?

        # If the login provider has not yet been set, then set it.
        if not json.login_providers[profile.provider]?
          ## Welcome email here!
          json.login_providers[profile.provider] = uid: profile.id
          logger.verbose name, "adding social network [#{profile.provider}] to
            existing user", profile.emails[0].value
          return Users.patch json.id, json

      logger.verbose name, "using social network [#{profile.provider}] from
        existing user", profile.emails[0].value
      user

    .catch (error) ->
      if error.message != "not found" then throw error

      # If the user did not exist, then create a new user
      password = Users.randomPassword()
      parameters =
        email: profile.emails[0].value
        full_name: "#{profile.name.givenName} #{profile.name.familyName}"
        login_providers: {}
        meta: hasTemporaryPassword: true
        password: Users.hashPassword password
        status: Users.statuses.ACTIVE

      # Set the login provider.
      parameters.login_providers[profile.provider] = uid: profile.id

      # Not create the user in the database
      logger.debug name, "user does not exist, creating new user", parameters
      Users.createPromise parameters
      .then (user) ->
        if not user? then throw new Error "registration error"
        else
          logger.debug name, "new user created with id", user.id
          Email.sendTemplate "Welcome to Kuwait & Me!",
            profile.emails[0].value, "user/welcome-oauth",
              password: password
              user: user.toJSON()
        user

    # Once the promise resolves we will have a user that has been just created
    # or previously signed up.
    .then (user) -> done null, user
    .catch (error) -> done error.message


  # Add cookie parsing support
  app.use cookieParser settings.cookieParser


  # add request.session cookie support, and use Redis for storage
  settings.session.store = sessions
  app.sessionInstance = session settings.session
  app.use app.sessionInstance


  # Initialize passport
  app.use passport.initialize()
  app.use passport.session()


  ###
    A helper function that nicely registers a passport strategy of an OAuth
    provider. This function safely checks if the provider has been enabled
    in the settings and registers them in passport using the proper values.

    @param {String} provider              Id of provider in use (eg: facebook)
    @param {PassportStrategy} Strategy    The Passport strategy for the
                                          given provider.
  ###
  _passport = (provider, Strategy) ->
    # If the provider's OAuth information don't exist or if the provider has
    # not been enabled then return.
    if not settings[provider]? or not settings[provider].enabled then return
    else logger.verbose name, "using '#{provider}' oauth authentication"

    # Set the callback URL
    options = callbackURL: "#{settings.url}/auth/oauth/#{provider}/callback"

    # Extend the prgeoperties from the settings file
    _.extend options, settings[provider].oauth

    # Now register the strategy in passport
    passport.use new Strategy options, providerAuthCallback

  # Using our helper function defined above, we start initialized the OAuth
  # login service for the different providers we support so far.
  _passport "amazon",      AmazonStrategy
  _passport "facebook",    FacebookStrategy
  _passport "google",      GoogleStrategy
  _passport "linkedin",    LinkedinStrategy
  _passport "twitter",     TwitterStrategy
  _passport "windowslive", WindowsStrategy


  # Email Authentication
  if settings.emailAuth.enabled
    passport.use new LocalStrategy (username, password, done) ->
      # First query the DB for the user.
      Users.findByUsernameOrEmail username
      .then (user) ->
        # Check if the user exists
        if not user? then throw new Error "bad username/email"

        # User exists, now get
        json = user.toJSON()
        logger.debug name, "user json", json

        # Check if password is valid
        if not Users.isPasswordValid password, json.password
          throw new Error "password mismatch"

        # Check if account is active or not.
        if not Users.isActive user
          # if json.meta and not json.meta.hasTemporaryPassword
          return throw new Error "not allowed to login"

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
  "libraries/email"

  "models/logs"
  "models/users"
]
