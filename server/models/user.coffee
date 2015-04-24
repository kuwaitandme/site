mongoose = require 'mongoose'
bCrypt   = require 'bcrypt-nodejs'

users = module.exports =
	model: mongoose.model 'user',
		# Main info
		username: String
		password: String
		email: String
		name: String

		activationToken: String
		adminReason: String
		isModerator: Boolean
		language: Number
		lastLogin: [ ]
		resetToken: String
		status: Number # 0:Inactive,1:Active,2:Banned

		# Personal information
		# personal:
			# address: String
			# gender: Number
			# location: Number
			# phone: String
			# website: String
			# email: String

	status:
		INACTIVE: 0
		ACTIVE: 1
		BANNED: 2


	# Creates a new user with the given username and password
	create: (name, username, password, callback) ->

		# If there is no user with that email, create the user
		newUser = new (@model)

		# set the user's local credentials
		newUser.personal.name = name
		newUser.username = username
		newUser.email = username
		newUser.password = createHash(password)

		# Give defaults to other parameters
		newUser.isAdmin = false
		newUser.language = 0
		newUser.status = @status.INACTIVE
		newUser.activationToken = randomHash()

		# Save and call the callback function
		newUser.save (err) ->
			callback err, newUser


	activate: (id, token, callback) ->
		@model.findOne { _id: id }, (err, user) ->
			if err then throw err

			# Check if user exists
			if not user then return callback(null, false)

			# Check the activation token
			if user.activationToken is not token
				return callback(null, false)

			# Activate the user
			user.activationToken = ''
			user.status = users.status.ACTIVE
			user.save (err) -> callback err, true


	createResetToken: (email, callback) ->
		@model.findOne { email: email }, (err, user) ->
			if err then throw err

			# Check if the user exists
			if not user then return callback(null, null)

			# Check if the user is activated
			if user.status is not users.status.ACTIVE
				callback null, null

			# Generate a reset token
			user.resetToken = randomHash()
			user.save (err) ->
				callback err, user


	resetPassword: (id, token, password, callback) ->
		@model.findOne { _id: id }, (err, user) ->
			if err then throw err

			# Check cast error

			# Check if user exists
			if not user then return callback(null, false)

			# Check if a password request was set or not
			if not user.resetToken then return callback(null, false)

			# Check the reset token
			if user.resetToken is not token then return callback(null, false)

			# Reset the user password and get rid of reset token
			user.password = createHash(password)
			user.resetToken = null
			user.save (err) ->
				callback err, true

	get: (id, callback) ->
		@model.findOne { _id: id }, (err, user) ->
			if err then throw err

			# Check cast error

			callback null, user


# Creates a salted hash from the given password.
createHash = (password) -> bCrypt.hashSync password, bCrypt.genSaltSync(10), null

# Helper function to create a random hash
randomHash = ->
	s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
	s4() + s4() + s4() + s4() + s4() + s4()