module.exports = (require '../../mainView').extend
	name: '[view:account-index]'

	checkRedirect: -> @currentUser.isAnonymous()
	redirectUrl: -> '/auth/login?error=need_login'