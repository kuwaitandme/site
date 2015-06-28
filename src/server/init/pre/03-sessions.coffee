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


exports = module.exports = (IoC, settings, sessions, Email, policies, Events,
Users) ->
  app = this
  logger = IoC.create "igloo/logger"
  name = "[session]"

  # This function gets called for each of the OAuth logins. A uniform function
  # that takes care of everything from DB.... FINISH
  providerAuthCallback = (accessToken, refreshToken, profile, done) ->
    logger.debug name, "got profile from OAuth:", profile.provider
    if profile.emails.length == 0 or (not _.isObject profile.emails[0]) or
    not validator.isEmail profile.emails[0].value
      return done new Error "no oauth email found"

    # Query for the user based on the provider.
    Users.findOne {email: profile.emails[0].value}
    .then (user) ->
      if not user? then throw new Error "not found"

      # User exists, check if the provider's details have been set and return
      # the user back to passport
      json = user.toJSON()

      # Start checking the login providers
      if json.login_providers?

        # If the login provider has not yet been set, then set it.
        if not json.login_providers[profile.provider]?
          ## Welcome email here!
          json.login_providers[profile.provider] = uid: profile.id
          logger.debug name, "adding social network [#{profile.provider}] to existing user", profile.emails[0].value
          return Users.patch json.id, json

      logger.debug name, "using social network [#{profile.provider}] from existing user", profile.emails[0].value
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


  # OAuth authentication
  _passport = (provider='', Strategy) ->
    if not settings[provider]? or not settings[provider].enabled then return
    logger.info "[passport]", "using '#{provider}' oauth authentication"
    options = {}
    options.callbackURL = "#{settings.url}/auth/oauth/#{provider}/callback"
    options = _.extend options, settings[provider].oauth
    passport.use new Strategy options, providerAuthCallback
  _passport "amazon",      AmazonStrategy
  _passport "facebook",    FacebookStrategy
  _passport "google",      GoogleStrategy
  _passport "linkedin",    LinkedinStrategy
  _passport "twitter",     TwitterStrategy
  _passport "windowslive", WindowsStrategy


  # Email Authentication
  if settings.emailAuth.enabled
    passport.use new LocalStrategy (username, password, done) ->
      Users.findOne {email: username}
      .then (user) ->
        logger.debug name, "fetched user", user
        if not user? then throw new Error "bad username/email"

        # User exists, check password
        json = user.toJSON()
        logger.debug name, "user json", json
        if not Users.isPasswordValid password, json.password
          throw new Error "password mismatch"

        # Check if account is active or not
        if not Users.isActive json
          if json.meta and not json.meta.hasTemporaryPassword
            return throw new Error "not allowed to login"

        # Login successful! return user
        user

      .then (user) -> done null, user
      .catch (error) -> done error.message

  # Add passport serialization/de-serialization
  passport.deserializeUser Users.deserialize()
  passport.serializeUser   Users.serialize()


exports["@require"] = [
  "$container"
  "igloo/settings"
  "igloo/sessions"
  "controllers/email"
  "policies"

  "models/events"
  "models/users"
]
