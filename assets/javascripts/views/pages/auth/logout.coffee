module.exports = (require '../../mainView').extend
	name: "[view:auth-logout]"

	# Let the app know that we want to redirect to the login page
	checkRedirect: ->
		@currentUser.logout()
		true
	redirectUrl: -> '/auth/login?success=logout'