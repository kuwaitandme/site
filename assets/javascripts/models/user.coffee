helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	consoleSlug: "[model:classified]"

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


	fetch: (id="") ->
		console.debug @consoleSlug, 'fetching currently loggedin user data'
		that = this
		$.ajax
			type: 'GET'
			url: app.config.host + '/api/user/' + id
			dataType: 'json'
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug that.consoleSlug, 'got user data', response

				# Save the data from the server
				that.set response

				# Signal any listeners that we are done loading the user
				that.trigger 'ajax:done', response


			error: (e) ->
				console.error 'Error fetching user data', e