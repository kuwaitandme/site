view = require '../mainView'
module.exports = view.extend
	name: '[view:terms]'

	start: (options) -> console.debug @name, 'starting', options