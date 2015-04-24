module.exports = (app) ->
	console.log "[directives] initializing"

	app.directive 'onScroll', require './onScroll'