controller = module.exports =
	get: (request, response, next) ->
		if not request.isAuthenticated() then return response.redirect '/auth/guest'

		args =
			bodyid: 'classified-post'
			description: null
			page: 'classified/post'
			title: response.__('title.classified.post')

		render = global.helpers.render
		render request, response, args, true