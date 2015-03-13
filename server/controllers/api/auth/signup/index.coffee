module.exports =
	post: require './post'

	routes: (router, base) ->
		base +='/signup'
		router.post base, @post