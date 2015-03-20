module.exports =
	get: (request, response, next) -> response.redirect '/guest/post'

	post:   require './post'
	single: require './single'

	routes: (router, base) ->
		router.get base + '/guest/',       @get
		router.get base + '/guest/post',   @post.get
		router.get base + '/guest/:id?',   @single.get