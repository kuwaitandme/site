helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	idAttribute: "_id"
	name: "[model:user]"

	url: ->
		id = @get 'id'
		if id then return "/api/user/#{id}"
		else '/api/user'


	defaults:
		adminReason: ''
		email: ''
		isAdmin: false
		language: 0
		lastLogin: [ '' ]
		status: 0
		username: ''
		personal:
			name: ''
			address: ''
			gender: 0
			location: 0
			phone: ''
			website: ''
			email: ''


	initialize: ->


	login: (username, password, callback) ->
		console.debug @name, 'logging in user'
		that = this

		$.ajax
			type: 'POST'
			url: app.config.host + '/api/auth/login/'
			beforeSend: ajax.setHeaders
			data:
				username: username
				password: password

			# This function gets called when the user successfully logs in
			success: (response) ->
				console.debug that.name, 'user logged in', response

				# Save the data from the server
				that.set response

				# Signal any listeners that the user has logged in
				that.trigger 'loggedin', response

				# Call the callback
				callback null, response

			# This function sends the error message to the callback
			error: (error) ->
				console.error that.name, 'error logging in', error
				callback(error, null)


	signup: (parameters, callback) ->
		console.debug @name, 'logging in user'
		that = this

		$.ajax
			type: 'POST'
			url: app.config.host + '/api/auth/signup/'
			beforeSend: ajax.setHeaders
			data: parameters
			# This function gets called when the user is created successfully
			success: (response) ->
				# Call the callback
				callback null, response

			# This function sends the error message to the callback
			error: (error) ->
				console.error that.name, 'error creating user', error
				callback(error, null)


	# Logs the user out and signals listeners if any.
	logout: ->
		@clear()

		# Signal any listeners that the user has logged out
		@trigger 'logout'


	# Returns true iff the user is anonymous
	isAnonymous: -> not @has "_id"