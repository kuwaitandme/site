view = require '../mainView'
module.exports = view.extend
	name: '[view:privacy]'

	start: (options) -> console.debug @name, 'initializing', options

	continue: -> console.log @name, 'rendering'