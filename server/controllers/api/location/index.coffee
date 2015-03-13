module.exports =
	get:    require './get'

	routes: (router, base) ->
		base +='/location'
		router.get      base, @get