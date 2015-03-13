module.exports = (request, response, next) ->
		response.contentType 'application/json'
		id = request.params.id

		# If no id was set, get the current user instance
		if not id
			user = request.user

			# If there was a logged in user, then return with some fields blanked
			# out
			if user
				user.password = ''
				user.activationToken = ''
				response.end (JSON.stringify user)

			# Else return a 404 Not found
			else
				response.status(404);
				response.end '{}'

		# An id was set, so query the DB for the user with that id
		else
			user = global.models.user
			user.get id, (err, user) ->
				if !user
					response.status 404
					response.end()
				else
					user.password = ''
					user.activationToken = ''
					response.end (JSON.stringify user)