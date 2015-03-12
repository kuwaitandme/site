module.exports = Backbone.View.extend
	consoleSlug: '[view:privacy]'


	initialize: (options) -> console.log @consoleSlug, 'initializing'


	render: -> console.log @consoleSlug, 'rendering'


	checkRedirect: -> false