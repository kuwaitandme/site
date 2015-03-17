classified = global.models.classified

controller = module.exports =
	get: (request, response, next) ->
		if not request.isAuthenticated()
			return response.redirect '/auth/login?error=need_login'

		args =
			page: 'classified/search'
			title: response.__('title.classified.search')
			data: classifieds: []

		render = global.helpers.render
		render request, response, args, true