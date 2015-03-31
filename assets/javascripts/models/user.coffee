helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	idAttribute: "_id"
	name: "[model:user]"

	url: ->
		id = @get 'id'
		if id then "#{App.Resources.Config.host}/api/user/#{id}"
		else "#{App.Resources.Config.host}/api/user"


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

		@$body = $ 'body'
		@on 'sync', => console.log @name, 'syncing'


		# Redirect fetch to our cached version of fetch
		@oldFetch = @fetch
		@fetch = (arg) => if not @newFetch arg then @oldFetch arg


	newFetch: ->
		@$body.removeClass 'loggedin'
		@$body.addClass 'loggedout'

		if not @id? and window.data.user?
		 	@set window.data.user
		 	@trigger 'sync'
		 	true
		 else false


	login: (username, password, callback) ->
		console.debug @name, 'logging in user'

		$.ajax
			type: 'POST'
			url: "#{App.Resources.Config.host}/api/auth/email/#{username}"
			beforeSend: ajax.setHeaders
			data:
				username: username
				password: password

			# This function gets called when the user successfully logs in
			success: (response) =>
				console.debug @name, 'user logged in', response

				@$body.addClass 'loggedin'
				@$body.removeClass 'loggedout'

				# Save the data from the server
				@set response

				# Signal any listeners that the user has logged in
				@trigger 'sync', response

				# Call the callback
				callback null, response

			# This function sends the error message to the callback
			error: (error) =>
				console.error @name, 'error logging in', error
				callback error


	signup: (parameters, callback) ->
		console.debug @name, 'signing up new user'

		$.ajax
			type: 'POST'
			url: "#{App.Resources.Config.host}/api/auth/email/"
			beforeSend: ajax.setHeaders
			data: parameters

			# This function gets called when the user is created successfully
			success: (response) -> callback null, response

			# This function sends the error message to the callback
			error: (error) =>
				console.error @name, 'error creating user', error
				callback error


	# Logs the user out and signals listeners if any.
	logout: ->
		$.get "#{App.Resources.Config.host}/api/auth/logout/"
		@clear()

		@$body.removeClass 'loggedin'
		@$body.addClass 'loggedout'

		# Signal any listeners that the user has logged out
		@trigger 'sync'


	# Returns true iff the user is anonymous
	isAnonymous: -> not @has "_id"