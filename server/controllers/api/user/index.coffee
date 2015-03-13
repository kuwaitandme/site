module.exports =
	delete: require './get'
	get:    require './get'
	post:   require './get'
	put:    require './get'

	routes: (router, base) ->
		base +='/user'
		router.delete   base + '/:id', @delete
		router.get      base + '/:id?', @get
		router.post     base + '/:id', @post
		router.put      base + '/', @put