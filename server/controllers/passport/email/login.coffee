bCrypt        = require 'bcrypt-nodejs'
validator     = require 'validator'
localStrategy = (require 'passport-local').Strategy

# Checks if the given username and password are valid or not.
isValidPassword = (user, password) -> bCrypt.compareSync password, user.password

# Registers a passport strategy to authenticate a user into the backend.
strategy = module.exports = (passport) ->

	authenticate = (request, username, password, done) ->

		captchaFail = (error, response) -> done null, null, ecode: 406

		captchaSuccess = (response) ->
			# Validate the username & password
			if not (validator.isEmail username) or not password
			# if not (emailRegex.test username) or not password
				return done null, false, ecode: 400

			# Check in Mongo if a user with username exists or not
			User = global.models.user
			User.model.findOne { 'username': username }, (error, user) ->
				if error then return done error

				# Username does not exist or User exists but wrong password
				if not user or not isValidPassword(user, password)
					return done null, false, ecode: 404

				# User is not activated
				if user.status == User.status.INACTIVE
					return done null, false, ecode: 401

				# User is banned
				if user.status == User.status.BANNED
					return done null, false,
						ecode: 406
						reason: user.adminReason

				# User and password both match, return user to the callback
				done null, user

		# Check the captcha, which then calls the function to login the user
		reCaptcha = global.helpers.reCaptcha
		reCaptcha.verify request, captchaSuccess, captchaFail

	passport.use 'emali-login', new localStrategy { passReqToCallback: true }, authenticate