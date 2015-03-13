module.exports =
	get:    require './get'

	routes: (router, base) ->
		base +='/category'
		router.get base, @get