module.exports = (require '../../mainView').extend
	name: "[view:auth-logout]"

	start: (@options) ->
		console.debug @name, 'initializing', @options

		# Signal the model that we want the current user to logout
		app.models.currentUser.logout()


	# Let the app know that we want to redirect to the login page
	checkRedirect: -> true


	# Perform the redirection to the login page
	redirect: ->
		console.log @name, 'redirecting to login page'
		app.goto '/auth/login?success=logout', 'auth-login'