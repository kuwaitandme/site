module.exports = (require '../classified/search').extend
	name: '[view:account-manage]'

	isAccount: true
	enableFilterBox: false

	checkRedirect: -> @currentUser.isAnonymous()
	redirectUrl: -> '/auth/login?error=need_login'