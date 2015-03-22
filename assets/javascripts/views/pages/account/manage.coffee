view = require '../classified/search'

module.exports = view.extend
	name: '[view:account-manage]'

	isAccount: true
	enableFilterBox: false

	# Let the app know that we want to redirect to the login page
	checkRedirect: -> @currentUser.isAnonymous()
	redirectUrl: -> '/auth/login?success=need_login'