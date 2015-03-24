passport = require 'passport'

# Controller for the Registering a user via email
module.exports = (request, response, next) ->
	response.contentType 'application/json'

	finish = (error, user, info) ->
		if error
			response.status 500
			return response.end JSON.stringify error

		if not user
			response.status info.ecode or 404
			response.end info.message
		else
			response.end JSON.stringify user

	(passport.authenticate 'email-signup', finish) request, response, next