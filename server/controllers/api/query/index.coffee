module.exports =
	get:    require './get'

	routes: (router, base) ->
		base +='/query'
		router.get      base, @get