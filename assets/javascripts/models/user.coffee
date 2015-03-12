helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	consoleSlug: "[model:user]"

	defaults:
		adminReason: ''
		email: ''
		isAdmin: false
		isAnonymous: true
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
		console.debug @consoleSlug, 'logging in user'
		that = this

		$.ajax
			type: 'POST'
			url: app.config.host + '/auth/login/'
			beforeSend: ajax.setHeaders
			data:
				username: username
				password: password

			# This function gets called when the user successfully logs in
			success: (response) ->
				console.debug that.consoleSlug, 'user logged in', response

				# Save the data from the server
				response.isAnonymous = false
				that.set response

				# Signal any listeners that the user has logged in
				that.trigger 'loggedin', response

				# Call the callback
				callback null, response

			# This function sends the error message to the callback
			error: (error) ->
				console.error that.consoleSlug, 'error logging in', error
				callback(error, null)


	# Logs the user out and signals listeners if any.
	logout: ->
		@set 'isAnonymous', true

		# Signal any listeners that the user has logged out
		@trigger 'logout'


	# Returns true iff the user is anonymous
	isAnonymous: ->
		return not (@attributes._id and @attributes._id.length > 1)


	fetch: (id="") ->
		console.debug @consoleSlug, 'fetching currently loggedin user data'
		that = this

		if id is "" and window.data.user
			console.log @consoleSlug, 'setting user from page'
			return @set window.data.user

		$.ajax
			type: 'GET'
			url: app.config.host + '/api/user/' + id
			dataType: 'json'
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug that.consoleSlug, 'got user data', response

				# Save the data from the server
				response.isAnonymous = false
				that.set response

				# Signal any listeners that we are done loading the user
				that.trigger 'ajax:done', response
			error: (response) ->
				switch response.status
					when 404
						that.logout()
						console.debug that.consoleSlug, 'user is anonymous', response
					else console.error 'Error fetching user data', response