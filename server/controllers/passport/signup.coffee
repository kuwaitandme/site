LocalStrategy = (require 'passport-local').Strategy

# A Passport strategy to register a new user. It checks if the username exists
# first, and if not then creates the user with the user name and hashes
# password.
#
# If the user has passed validation, then an activation email is sent to the
# user.
strategy = module.exports = (passport) ->

	signup = (request, username, password, done) ->

		captachFail = -> done null, false, ecode: 406

		captachSuccess = ->
			fullname = request.body.fullname
			repassword = request.body.repassword

			# Regex to check for email and name
			reName = /^[\d\s\w]+$/
			reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

			# Check for any missing fields
			if !fullname or !repassword or !password or !username
				return done(null, false, ecode: 400)

			# Check for password mis-match
			if password != repassword
				done null, false, ecode: 400

			# Check for invalid characters
			if !reEmail.test(username) or !reName.test(fullname)
				done null, false, ecode: 400

			# Find a user in the database with provided username
			User = global.models.user
			User.model.findOne { 'username': username }, (err, user) ->
				if err then return done(err, false)

				# User already exists
				if user then return done(null, false, ecode: 403)

				# If there is no user with that email, create the user
				User.create fullname, username, password, (err, user) ->
					if err then throw err

					# Send activation email
					Email = global.controllers.email
					Email.sendTemplate user.email, 'activate',
						subject: 'Account activation'
						user: user

					# pass the registered user to the callback
					done null, user

		# Check the captcha, which then calls the function to create the user
		reCaptcha = global.helpers.reCaptcha
		reCaptcha.verify request, captachSuccess, captachFail

	passport.use 'signup', (new LocalStrategy({ passReqToCallback: true }, signup))