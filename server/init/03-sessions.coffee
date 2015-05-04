flash                 = require "connect-flash"
passport              = require "passport"
session               = require "express-session"
cookieParser          = require "cookie-parser"
randomstring          = require "randomstring-extended"
connectLiveReload     = require "connect-livereload"
validator             = require "validator"
_                     = require "underscore"

GoogleStrategy        = (require "passport-google-oauth").OAuth2Strategy
GoogleTokenStrategy   = (require "passport-google-token").Strategy
FacebookStrategy      = (require "passport-facebook").Strategy
FacebookTokenStrategy = (require "passport-facebook-token").Strategy


exports = module.exports = (IoC, settings, sessions, User, policies) ->
  app = this
  # pass a secret to cookieParser() for signed cookies

  providerAuthCallback = (accessToken, refreshToken, profile, done) ->
    if profile.emails.length == 0 or !_.isObject(profile.emails[0]) or !validator.isEmail(profile.emails[0].value)
      return done(new Error("Your account did not have an email address associated with it"))
    $or = [ { email: profile.emails[0].value } ]

    # normalize the auth callbacks by simply pushing to the
    # $or query that will be executed with User.findOne below
    # this allows us to simply have one auth callback for
    # different providers like Facebook, Google, etc.
    provider = {}
    provider["#{profile.provider}_id"] = profile.id

    # note that we unshift instead of push, since we want findOne
    # to return the user based off `profile.id` which takes
    # precedence over the user"s email address in `profile.emails`
    $or.unshift provider
    User.findOne { $or: $or }, (error, user) ->
      if error then return done error
      if user
        if not user["#{profile.provider}_id"]
          user["#{profile.provider}_id"] = profile.id
        if accessToken
          user["#{profile.provider}_access_token"] = accessToken
        if refreshToken
          user["#{profile.provider}_refresh_token"] = refreshToken
        return user.save done

      user =
        email: profile.emails[0].value
        name: profile.name.givenName
        surname: profile.name.familyName

      user["#{profile.provider}_id"] = profile.id
      if accessToken
        user["#{profile.provider}_access_token"] = accessToken
      if refreshToken
        user["#{profile.provider}_refresh_token"] = refreshToken

      # if the user signed in with another service
      # then create a random password for them
      User.register user, randomstring.token(), (error, user) ->
        if error then return done error
        if not user?
          return done new Error "An error has occured while registering, please try later"

        done null, user
        user.sendWelcomeEmail()


  app.all policies.notApiRouteRegexp, cookieParser settings.cookieParser
  # add req.session cookie support
  settings.session.store = sessions
  app.all policies.notApiRouteRegexp, session settings.session

  # # support live reload
  # # (note this must come after sessions)
  # # <http://stackoverflow.com/a/26740588>
  # if (settings.server.env === "development")
  #   app.all(policies.notApiRouteRegexp, connectLiveReload(settings.liveReload));
  # add support for authentication

  app.use passport.initialize()
  app.all policies.notApiRouteRegexp, passport.session()

  # add flash message support
  app.use session(settings.session)
  app.use flash()
  app.all policies.notApiRouteRegexp, flash()

  # add passport strategies
  # passport.use(User.createStrategy());
  # passport.serializeUser(User.serializeUser());
  # passport.deserializeUser(User.deserializeUser());

  # Google Authentication
  # if settings.google.enabled
  #   # web-based
  #   passport.use new GoogleStrategy({
  #     callbackURL: settings.url + "/auth/google/callback"
  #     clientID: settings.google.clientID
  #     clientSecret: settings.google.clientSecret
  #   }, providerAuthCallback)
  #   # token-based
  #   passport.use new GoogleTokenStrategy({
  #     clientID: settings.google.clientID
  #     clientSecret: settings.google.clientSecret
  #   }, providerAuthCallback)

  # Facebook Authentication
  if settings.facebook.enabled
    # web-based
    passport.use new FacebookStrategy
      callbackURL:  "#{settings.url}/auth/facebook/callback"
      clientID: settings.facebook.appID
      clientSecret: settings.facebook.appSecret
    , providerAuthCallback

    # token-based
    passport.use new FacebookTokenStrategy
      clientID: settings.facebook.appID
      clientSecret: settings.facebook.appSecret
    , providerAuthCallback

exports["@require"] = [
  "$container"
  "igloo/settings"
  "igloo/sessions"
  "models/users"
  "policies"
]