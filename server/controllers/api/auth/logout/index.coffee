module.exports =
	get: require './get'

	routes: (router, base) -> router.get base + '/logout', @get