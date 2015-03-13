module.exports =
	get: require './get'

	routes: (router, base) ->
		base +='/logout'
		router.get base, @get