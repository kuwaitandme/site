module.exports =
	delete: require './get'
	get:    require './get'
	post:   require './post'
	put:    require './post'

	routes: (router, base) ->
		router.delete   base + '/classified/:id?', @delete
		router.get      base + '/classified/:id?', @get
		router.post     base + '/classified/:id?', @post
		router.put      base + '/classified/', @put