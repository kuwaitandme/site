module.exports = Backbone.View.extend
	consoleSlug: '[view:privacy]'


	initialize: (options) -> console.debug @consoleSlug, 'initializing', options


	render: -> console.log @consoleSlug, 'rendering'


	checkRedirect: -> false