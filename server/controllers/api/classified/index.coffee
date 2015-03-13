module.exports =
	delete: require './get'
	get:    require './get'
	post:   require './get'
	put:    require './put'

	routes: (router, base) ->
		base +='/classified'
		router.delete   base + '/:id?', @delete
		router.get      base + '/:id?', @get
		router.post     base + '/:id?', @post
		router.put      base + '/', @put