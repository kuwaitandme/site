bCrypt        = require 'bcrypt-nodejs'
LocalStrategy = (require 'passport-local').Strategy

# Checks if the given username and password are valid or not.
isValidPassword = (user, password) -> bCrypt.compareSync password, user.password

# Registers a passport strategy to authenticate a user into the backend.
strategy = module.exports = (passport) ->

	authenticate = (request, username, password, done) ->

		captachFail = (err, response) -> done null, null, ecode: 400

		captachSuccess = (response) ->
			# Validate the username & password
			emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if not (emailRegex.test username) or not password
				return done(null, false, ecode: 400)

			# Check in Mongo if a user with username exists or not
			User = global.models.user
			User.model.findOne { 'username': username }, (err, user) ->
				if err then return done(err)

				# Username does not exist or User exists but wrong password
				if !user or !isValidPassword(user, password)
					return done(null, false, ecode: 404)

				# User is not activated
				if user.status == User.status.INACTIVE
					return done(null, false, ecode: 401)

				# User is banned
				if user.status == User.status.BANNED
					return done(null, false,
						ecode: 406
						reason: user.adminReason)

				# User and password both match, return user to the callback
				done null, user
		# Check the captcha, which then calls the function to login the user
		reCaptcha = global.helpers.reCaptcha
		reCaptcha.verify request, captachSuccess, captachFail

	passport.use 'login', (new LocalStrategy({ passReqToCallback: true }, authenticate))