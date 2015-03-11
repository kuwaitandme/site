helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
	consoleSlug: "[model:user]"

	defaults:
		adminReason: ''
		email: ''
		isAdmin: false
		isAnonymous: false
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
				response.isAnonymous = false
				that.set response

				# Signal any listeners that we are done loading the user
				that.trigger 'ajax:done', response


			error: (response) ->
				switch response.status
					when 404
						that.set 'isAnonymous', true
						console.debug that.consoleSlug, 'user is anonymous', response
				# console.error 'Error fetching user data', response