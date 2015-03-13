module.exports =
	post: require './post'

	routes: (router, base) ->
		base +='/activate'
		router.post base, @post