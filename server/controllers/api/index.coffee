config = global.config

module.exports =
	get: (request, response, next) ->
		response.contentType 'application/json'
		response.end JSON.stringify
			author: 'Steven Enamakel'
			status: 'online'
			jsVersion: config.jsVersion


	routes: (router, base='/api') ->
		router.get base, @get
		(require './auth').routes(router, base)
		(require './category').routes(router, base)
		(require './classified').routes(router, base)
		(require './location').routes(router, base)
		(require './query').routes(router, base)
		(require './user').routes(router, base)