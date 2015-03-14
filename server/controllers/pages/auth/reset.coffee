controller = module.exports =
	get: (request, response, next) ->
		id = request.params.id
		resetToken = request.query.token or ''

		# Clean out the parameters
		if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
			return next()

		args =
			bodyid: 'auth-reset'
			page: 'auth/reset'
			title: response.__('title.auth.reset'),

		render = global.helpers.render
		render request, response, true