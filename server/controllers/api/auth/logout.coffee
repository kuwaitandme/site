module.exports =
	get: (request, response, next) ->
		request.session.destroy()
		response.end '"session destroyed"'

	routes: (router, base) ->
		router.get    base + '/logout', @get