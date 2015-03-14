helpers = require 'app-helpers'
ajax = helpers.ajax

view = require '../../mainView'
module.exports = view.extend
	name: "[view:auth-logout]"


	start: (options) ->
		console.debug @name, 'initializing', options
		@sendAjax()
		app.currentUser.clear()


	continue: -> console.log @name, 'rendering'


	# Let the app know that we want to redirect to the login page
	checkRedirect: ->
		@$el.html("")
		true


	# Perform the redirection to the login page
	doRedirect: ->
		console.log @name, 'redirecting to login page'
		app.goto '/auth/login?success=logout', 'auth-login'


	sendAjax: -> $.get '/auth/logout'