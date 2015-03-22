module.exports = (require '../../mainView').extend
	name: "[view:auth-logout]"

	start: (@options) ->
		console.debug @name, 'initializing', @options

		# Signal the model that we want the current user to logout
		@currentUser.logout()


	# Let the app know that we want to redirect to the login page
	checkRedirect: -> true
	redirectUrl: -> '/auth/login?success=logout'