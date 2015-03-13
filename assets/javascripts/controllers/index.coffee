localStorage   = require './localStorage'
pageTransition = require './pageTransition'
router         = require './router'
# instance = null

# Initializes each of the controllers one by one.
module.exports =

	consoleSlug: '[controller]'

	initialize: (config) ->
		# if instance then return @ = instance
		# else instance = @

		console.log @consoleSlug, 'initializing'

		@localStorage = new localStorage config
		@router = new router config
		@pageTransition = new pageTransition config