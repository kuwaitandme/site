validator     = require 'validator'
localStrategy = (require 'passport-local').Strategy

checkLoginAttempts = (session, id) ->
	session.attempts = session.attempts or 0
	if session.attempts++ > 50 then return false
	true

resetLoginAttempts = (session) -> session.attempts = 0


authenticate = (request, username, password, done) ->

	if not checkLoginAttempts request.session
		return done 'too many failed attempts', false, 401

	# Validate the username & password
	if not (validator.isEmail username) or not password
		return done 'invalid username/password', false, 400

	# Check in Mongo if a user with username exists or not
	User = global.models.user
	User.model.findOne { 'username': username }, (error, user) ->
		if error then return done error

		# Username does not exist or User exists but wrong password
		if not user then return done 'user not found', false, 404

		switch user.status
			# User is not activated
			when User.status.INACTIVE
				return done 'user not activated', false, 406

			# User is banned
			when User.status.BANNED
				return done user.adminReason, false, 406

			# User is suspended
			when User.status.SUSPEND
				return done user.adminReason, false, 406

		# Password mismatch
		User.auth.email.validate user, password, (error, user) ->
			if error then return done error, false, 401

			# User and password both match, return user to the callback
			resetLoginAttempts request.session, user
			done null, user

# Registers a passport strategy to authenticate a user into the backend.
module.exports = (passport) -> passport.use 'email-login',
	new localStrategy { passReqToCallback: true }, authenticate