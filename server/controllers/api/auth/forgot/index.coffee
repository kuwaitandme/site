module.exports =
	post: require './post'

	routes: (router, base) ->
		base +='/forgot'
		router.post base, @post