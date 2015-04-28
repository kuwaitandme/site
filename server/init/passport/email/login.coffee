validator     = require 'validator'
localStrategy = (require 'passport-local').Strategy


# Registers a passport strategy to authenticate a user into the backend.
module.exports = (settings, passport, user) ->
  console.log  user.get
  _authenticate = (request, username, password, done) ->
    console.log username, password
    resetLoginAttempts = (session) -> session.attempts = 0
    checkLoginAttempts = (session, id) ->
      session.attempts = session.attempts or 0
      if session.attempts++ > 50 then return false
      true

    if not checkLoginAttempts request.session
      return done status: 'too many failed attempts'

    # Validate the username & password
    if not (validator.isEmail username) or not password
      return done status: 'invalid username/password'

    # Check in Mongo if a user with username exists or not
    user.model.findOne { 'username': username }, (error, result) ->
      console.log error, result
      if error then return done error
      # Username does not exist or User exists but wrong password
      if not result then return done status: 'user not found'

      switch result.status
        # User is not activated
        when user.status.INACTIVE
          return done status: 'user not activated'

        # User is banned
        when user.status.BANNED
          reason = status: 'banned', reason: result.adminReason
          return done reason

        # User is suspended
        when user.status.SUSPEND
          reason = status: 'suspended', reason: result.adminReason
          return done reason

      user.auth.email.validate result, password, (error, result={}) ->
        console.log error, result
        # Password mismatch
        if error
          # logger = global.modules.logger
          # logger request, "failed login for #{username}"
          return done error

        # logger = global.modules.logger
        # logger request, "successful login for #{username} with id:#{user._id}"

        # User and password both match, return user to the callback
        resetLoginAttempts request.session, result
        done null, result

  passport.use 'email-login',
    new localStrategy { passReqToCallback: true }, _authenticate