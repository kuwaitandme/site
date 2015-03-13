module.exports =
	post: require './post'

	routes: (router, base) ->
		base +='/login'
		router.post base, @post