validator = require 'validator'

controller = module.exports =
	get: (request, response, next) ->
		id         = request.params.id
		resetToken = request.query.token or ''

		# Validate the parameters
		if resetToken.length != 24 or not validator.isMongoId id then return next()

		args =
			bodyid: 'auth-reset'
			page: 'auth/reset'
			title: response.__('title.auth.reset'),

		render = global.helpers.render
		render request, response, true