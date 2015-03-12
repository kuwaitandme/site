view = require '../classified/search'

module.exports = view.extend
	consoleSlug: '[view:account-manage]'

	isAccount: true

	checkRedirect: -> false