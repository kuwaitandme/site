helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	idAttribute: "_id"
	name: "[model:user]"

	url: ->
		id = @get 'id'
		if id then "#{app.config.host}/api/user/#{id}"
		else "#{app.config.host}/api/user"


	defaults:
		adminReason: ''
		email: ''
		isModerator: false
		language: 0
		lastLogin: [ ]
		status: 0
		username: ''
		credits: 0
		name: ''
		description: ''
		personal: { }


	initialize: ->
		console.log @name, 'initializing'

		self = @
		@on 'sync', -> console.log self.name, 'syncing'


		# Redirect fetch to our cached version of fetch
		@oldFetch = @fetch
		@fetch = (arg) -> if not @newFetch arg then @oldFetch arg

	newFetch: ->
		if not @id? and window.data.user?
		 	@set window.data.user
		 	@trigger 'sync'
		 	true
		 else false

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
				that.trigger 'sync', response

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
		$.get '/auth/logout'
		@clear()

		# Signal any listeners that the user has logged out
		@trigger 'sync'


	# Returns true iff the user is anonymous
	isAnonymous: -> not @has "_id"