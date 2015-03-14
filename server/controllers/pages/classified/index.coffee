module.exports =
	get: (request, response, next) -> response.redirect '/guest/post'

	post:   require './post'
	search: require './search'
	single: require './single'

	routes: (router, base) ->
		router.get base + '/classified/',       @get
		router.get base + '/classified/post',   @post.get
		router.get base + '/classified/search', @search.get
		router.get base + '/classified/single', @single.get