passport              = require "passport"
session               = require "express-session"
cookieParser          = require "cookie-parser"
randomstring          = require "randomstring-extended"
connectLiveReload     = require "connect-livereload"
validator             = require "validator"
_                     = require "underscore"

GoogleStrategy        = (require "passport-google-oauth").OAuth2Strategy
FacebookStrategy      = (require "passport-facebook").Strategy
LocalStrategy         = (require "passport-local").Strategy

exports = module.exports = (IoC, settings, sessions, Email, Users, policies) ->
  app = this

  # This function gets called for each of the OAuth logins. A uniform function
  # that takes care of everything from DB.... FINISH
  providerAuthCallback = (accessToken, refreshToken, profile, done) ->
    if profile.emails.length == 0 or (not _.isObject profile.emails[0]) or
    not validator.isEmail profile.emails[0].value
      return done new Error "Your account did not have an email address associated with it"
    # Query for the user based on the provider.
    Users.findOne
      email: profile.emails[0].value
      # login_provider_name: profile.provider
      # login_provider_uid: profile.id
    , (error, user) ->
      if error then return done error
      # User exists, check if the provider's details have been set and return
      # the user back to passport
      if user
        json = user.toJSON()
        if not json.login_providers? and json[profile.provider]?
          json.login_providers[profile.provider] = uid: profile.id
          Users.patch json.id, json # Check for errors here
        return done null, user
      # If the user did not exist, then create a new user
      password = Users.randomPassword()
      newUser =
        email: profile.emails[0].value
        full_name: "#{profile.name.givenName} #{profile.name.familyName}"
        status: Users.statuses.ACTIVE
        password: Users.hashPassword password
        login_providers: {}
      newUser.login_providers[profile.provider] = uid: profile.id
      Users.create newUser, (error, user) ->
        if error then done error
        else if not user? then done new Error "We can't register you, please try again later"
        else
          Email.sendTemplate profile.emails[0].value, "user-welcome-oauth",
            user: user.toJSON()
            password: password
            subject: "Welcome to Kuwait & Me!"
          done null, user

  # Add cookie parsing support
  app.use cookieParser settings.cookieParser

  # add request.session cookie support
  settings.session.store = sessions
  app.use session settings.session

  # Initialize passport
  app.use passport.initialize()
  app.use passport.session()

  # add session, and use Redis for storage
  app.use session settings.session

  # Google Authentication
  if settings.google.enabled
    passport.use new GoogleStrategy # web-based
      callbackURL: "#{settings.url}/auth/social/google/callback"
      clientID: settings.google.clientID
      clientSecret: settings.google.clientSecret
    , providerAuthCallback

  # Facebook Authentication
  if settings.facebook.enabled
    passport.use new FacebookStrategy # web-based
      callbackURL:  "#{settings.url}/auth/social/facebook/callback"
      clientID: settings.facebook.appID
      clientSecret: settings.facebook.appSecret
    , providerAuthCallback

  # Email Authentication
  if settings.emailAuth.enabled
    passport.use new LocalStrategy (username, password, done) ->
      Users.findOne { email: username }, (error, user) ->
        if error then return done error
        if not user? then return done "bad username/email", false
        # User exists, check password
        if not Users.isPasswordValid password, user.toJSON().password
          return done "password mismatch", false
          # Check if account is active or not
          if not Users.isActive user
            return done "not allowed to login", false
        # Login successful! return user
        done null, user

  # Add passport serialization/de-serialization
  passport.deserializeUser Users.deserialize()
  passport.serializeUser   Users.serialize()


exports["@require"] = [
  "$container"
  "igloo/settings"
  "igloo/sessions"
  "controllers/email"
  "models/users"
  "policies"
]