passport              = require "passport"
session               = require "express-session"
cookieParser          = require "cookie-parser"
randomstring          = require "randomstring-extended"
connectLiveReload     = require "connect-livereload"
validator             = require "validator"
_                     = require "underscore"

# EmailLoginStrategy    = require ""
GoogleStrategy        = (require "passport-google-oauth").OAuth2Strategy
GoogleTokenStrategy   = (require "passport-google-token").Strategy
FacebookStrategy      = (require "passport-facebook").Strategy
FacebookTokenStrategy = (require "passport-facebook-token").Strategy


exports = module.exports = (IoC, settings, sessions, User, policies) ->
  app = this

  # This function gets called for each of the OAuth logins. A uniform function
  # that takes care of everything from DB.... FINISH
  providerAuthCallback = (accessToken, refreshToken, profile, done) ->
    if profile.emails.length == 0 or (not _.isObject profile.emails[0]) or
    not validator.isEmail profile.emails[0].value
      return done new Error "Your account did not have an email address associated with it"
    # Query for the user based on the provider.
    User.findOne
      login_provider_name: profile.provider
      login_provider_uid: profile.id
    , (error, user) ->
      if error then return done error
      if user then return done null, user.toJSON()
      # If the user did not exist, then create a new user
      User.create
        email: profile.emails[0].value
        full_name: "#{profile.name.givenName} #{profile.name.familyName}"
        login_provider_name: profile.provider
        login_provider_uid: profile.id
      , (error, user) ->
        if error then done error
        else if not user? then done new Error "We can't register you, please try again later"
        else done null, user
        # email.sendTemplate "welcome-email", user: user


  app.use cookieParser settings.cookieParser

  # add request.session cookie support
  settings.session.store = sessions
  app.use session settings.session

  # Initialize passport
  app.use passport.initialize()
  app.use passport.session()

  # add session, and use Redis for storage
  app.use session settings.session

  # Add passport strategies
  if settings.google.enabled # Google Authentication
    passport.use new GoogleStrategy # web-based
      callbackURL: "#{settings.url}/auth/social/google/callback"
      clientID: settings.google.clientID
      clientSecret: settings.google.clientSecret
    , providerAuthCallback
    passport.use new GoogleTokenStrategy # token-based
      clientID: settings.google.clientID
      clientSecret: settings.google.clientSecret
    , providerAuthCallback

  if settings.facebook.enabled # Facebook Authentication
    passport.use new FacebookStrategy # web-based
      callbackURL:  "#{settings.url}/auth/social/facebook/callback"
      clientID: settings.facebook.appID
      clientSecret: settings.facebook.appSecret
    , providerAuthCallback
    passport.use new FacebookTokenStrategy # token-based
      clientID: settings.facebook.appID
      clientSecret: settings.facebook.appSecret
    , providerAuthCallback

  if settings.basicAuth.enabled # Email Authentication
    passport.use "email-login", new localStrategy
      passReqToCallback: true
    , authenticateEmail
    passport.use "email-signup", new localStrategy
      passReqToCallback: true
    , registerEmail

  # Add passport serialization/de-serialization
  passport.deserializeUser User.deserialize()
  passport.serializeUser   User.serialize()


exports["@require"] = [
  "$container"
  "igloo/settings"
  "igloo/sessions"
  "models/users"
  "policies"
]