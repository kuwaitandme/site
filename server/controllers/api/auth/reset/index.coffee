module.exports =
	post: require './post'

	routes: (router, base) -> router.post base + '/reset/:id?', @post