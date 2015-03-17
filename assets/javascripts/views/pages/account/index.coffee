view = require '../classified/search'

module.exports = view.extend
	name: '[view:account-index]'

	start: (options) -> console.debug @name, 'initializing', options

	continue: -> console.log @name, 'rendering'