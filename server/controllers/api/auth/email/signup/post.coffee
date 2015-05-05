passport = require "passport"
validator = require "validator"

# Controller for the Registering a user via email
exports = module.exports = (User, reCaptcha) ->
  (request, response, next) ->
    captchaFail = ->
      response.status 400
      response.json "recaptcha failed"

    captchaSuccess = ->
      email = request.body.username
      fullname = request.body.fullname
      password = request.body.password
      repassword = request.body.repassword

      # Check for any missing fields
      if not fullname or not repassword or not password or not email
        response.status 400
        return response.json "missing fields"

      # Check for password mis-match
      if password is not repassword
        response.status 400
        return response.json "password mismatch"

      # Check for invalid characters
      if not (validator.isEmail email) or
      not (validator.matches fullname, /[a-zA-Z\s]*/)
        response.status 400
        return response.json "bad email/name"

      # Find a user in the database with provided email
      User.findOne email: email , (error, user) ->
        if error
          response.status 500
          return response.json error

        # User already exists
        if user
          response.status 409
          return response.json "user already exists"

        newUser =
          full_name: fullname
          email: email
          password: User.hashPassword password
          login_provider_name: "email"

        # If there is no user with that email, create the user
        User.create newUser, (error, user) ->
          if error
            response.status 500
            return response.json error

          # logger = global.modules.logger
          # logger request, "user registered (EMAIL) with id:#{user._id}"

          # Send activation email
          # Email = global.modules.email
          # Email.sendTemplate user.email, "activate",
          #   subject: "#{fullname}! Activate your account"
          #   user: user

          # pass the registered user to the callback
          response.json user

    # Check the captcha, which then lls the function to create the user
    captchaSuccess()
    # reCaptcha.verify request, captchaSuccess, captchaFail

exports["@require"] = [
  "models/users"
  "controllers/recaptcha"
]
exports["@singleton"] = true