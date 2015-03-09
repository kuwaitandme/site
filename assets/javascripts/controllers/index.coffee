localStorage = require('./localStorage')
pageTransition = require('./pageTransition')
router = require('./router')
resourceLoader = require('./resourceLoader')

# Initializes each of the controllers one by one.
#
# @param  Object   config   The config object containing settings for each
#                           of the controller.
module.exports = initialize: (config) ->
	@consoleSlug = '[controller]'
	console.group @consoleSlug, 'initializing'

	@localStorage = new localStorage
	@router = new router
	@pageTransition = new pageTransition
	@resourceLoader = new resourceLoader

	console.groupEnd()