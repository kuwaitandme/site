localStorage   = require './localStorage'
pageTransition = require './pageTransition'
router         = require './router'

# Initializes each of the controllers one by one.
module.exports = initialize: (config) ->
	@consoleSlug = '[controller]'
	console.log @consoleSlug, 'initializing'

	@localStorage = new localStorage config
	@router = new router config
	@pageTransition = new pageTransition config