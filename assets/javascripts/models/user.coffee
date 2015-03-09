module.exports = Backbone.Model.extend(
	defaults:
		username: ''
		email: ''
		adminReason: ''
		isAdmin: Boolean
		language: 0
		lastLogin: [ '' ]
		status: 0
		personal:
			name: ''
			address: ''
			gender: 0
			location: 0
			phone: ''
			website: ''
			email: ''


	initialize: ->
		# this.bind('set', this.filterParameters)


	authenticate: (username, password) ->


	fetch: (id) ->
		console.debug 'Fetching user data'
		that = this
		$.ajax
			type: 'POST'
			url: app.config.host + '/user/' + id
			dataType: 'json'
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug 'Got user data', response

				# Save the data from the server
				@set response

				# Signal any listeners that we are done loading the user
				that.trigger 'ajax:done', response


			error: (e) ->
				console.error 'Error fetching user data', e