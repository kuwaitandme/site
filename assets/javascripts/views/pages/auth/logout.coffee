helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.View.extend
	consoleSlug: "[view:auth-logout]"


	initialize: (options) ->
		console.debug @consoleSlug, 'initializing', options
		@sendAjax()
		app.currentUser.clear()


	render: -> console.log @consoleSlug, 'rendering'


	# Let the app know that we want to redirect to the login page
	checkRedirect: -> true


	# Perform the redirection to the login page
	doRedirect: ->
		console.log @consoleSlug, 'redirecting to login page'
		app.goto '/auth/login?success=logout', 'auth-login'


	sendAjax: -> $.get '/auth/logout'