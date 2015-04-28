localStrategy = (require 'passport-local').Strategy
validator     = require 'validator'

# A Passport strategy to register a new user. It checks if the username exists
# first, and if not then creates the user with the user name and hashes
# password.
#
# If the user has passed validation, then an activation email is sent to the
# user.
_signup = (request, username, password, done) ->
  captchaFail = -> done status: 'Captcha failed'
  captchaSuccess = ->
    fullname = request.body.fullname
    repassword = request.body.repassword

    # Check for any missing fields
    if !fullname or !repassword or !password or !username
      return done status: 'missing fields'

    # Check for password mis-match
    if password != repassword
      return done status: 'password mismatch'

    # Check for invalid characters
    if not (validator.isEmail username) or
    not (validator.matches fullname, /[a-zA-Z\s]*/)
      return done status: 'invalid email/name'

    # Find a user in the database with provided username
    User = global.models.user
    User.model.findOne username: username , (error, user) ->
      if error then return done error

      # User already exists
      if user then return done status: 'user already exists'

      # If there is no user with that email, create the user
      User.auth.email.create fullname, username, password, (error, user) ->
        if error then return done error

        logger = global.modules.logger
        logger request, "user registered (EMAIL) with id:#{user._id}"

        # Send activation email
        Email = global.modules.email
        Email.sendTemplate user.email, 'activate',
          subject: "#{fullname}! Activate your account"
          user: user

        # pass the registered user to the callback
        done null, user

  # Check the captcha, which then lls the function to create the user
  reCaptcha = global.modules.recaptcha
  reCaptcha.verify request, captchaSuccess, captchaFail

module.exports = (settings, passport, user) ->
  passport.use 'email-signup',
    new localStrategy { passReqToCallback: true }, _signup