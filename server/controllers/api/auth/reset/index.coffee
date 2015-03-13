module.exports =
	post: require './post'

	routes: (router, base) ->
		base +='/reset'
		router.post base + '/:id', @post