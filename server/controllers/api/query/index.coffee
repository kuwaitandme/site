module.exports =
	get: require './get'

	routes: (router, base) -> router.post base + '/query', @get