localStorage   = require './localStorage'
# pageTransition = require './pageTransition'
router         = require './router'
viewManager    = require './viewManager'

# Initializes each of the controllers one by one.
module.exports =
	consoleSlug: '[controller]'

	initialize: (app, config) ->
		console.log @consoleSlug, 'initializing'

		@localStorage   = new localStorage app, config
		@router         = new router app, config
		# @pageTransition = new pageTransition app, config
		@viewManager    = new viewManager app, config


	start: ->
		console.log @consoleSlug, 'starting'
		# @pageTransition.start()
		@viewManager.start()