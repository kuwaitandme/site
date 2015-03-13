passport = require 'passport'

# Controller for the Signup page. Attempts to register the user in.
#
# If registration was successful, redirect to the classified posting page so
# that the user can start posting his/her classified.
module.exports = (request, response, next) ->
	response.contentType 'application/json'

	finish = (error, user, info) ->
		if error then return next error

		if not user
			response.status info.ecode or 404
			response.end(info.message)
		else
			response.end (JSON.stringify user)

	(passport.authenticate 'signup', finish) request, response, next