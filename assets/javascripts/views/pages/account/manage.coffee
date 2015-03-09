view = require('../classified/search')

module.exports = view.extend

	render: (options) ->
		$('#classified-search').addClass 'show-statuses'