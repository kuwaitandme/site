passport = require 'passport'

# Controller for the Registering a user via email
module.exports = (request, response, next) ->
	response.contentType 'application/json'

	finish = (error, user, errorcode) ->
		if error
			response.status errorcode or 400
			response.end JSON.stringify error
		else response.end JSON.stringify user

	(passport.authenticate 'email-signup', finish) request, response, next