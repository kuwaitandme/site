validator = require 'validator'

controller = module.exports =
	get: (request, response, next) ->
		# Check if the user is loggedin or not
		if not request.isAuthenticated()
			return response.redirect '/auth/login?error=need_login'

		# Get and validate the id
		id = request.params.id
		if not validator.isMongoId id then return next()

		# Get the classified
		classified = global.models.classified
		classified.get id, (error, classified) ->
			if error then return next error

			# Display 404 page if classified is not found
			if not classified then return next()

			render = global.helpers.render
			render request, response,
				data: classified: classified
				description: classified.description
				page: 'classified/edit'
				title: response.__('title.classified.post')