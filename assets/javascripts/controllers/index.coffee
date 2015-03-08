localStorage = require('./localStorage')
pageTransition = require('./pageTransition')
router = require('./router')
resourceLoader = require('./resourceLoader')

# Initializes each of the controllers one by one.
#
# @param  Object   config   The config object containing settings for each
#                           of the controller.
module.exports = initialize: (config) ->
	console.group '[controller] initializing'
	@localStorage = new localStorage
	@router = new router
	@pageTransition = new pageTransition
	@resourceLoader = new resourceLoader
	@localStorage.initialize config.localStorage
	@router.initialize config.router
	@pageTransition.initialize config.pageTransition
	@resourceLoader.initialize config.resourceLoader
	console.groupEnd()