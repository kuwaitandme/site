passport = require 'passport'

# Controller for the login page. Attempts to log the user in.
#
# TODO improve error handling here
module.exports = (request, response, next) ->
	response.contentType 'application/json'

	# Modify the request by assigning the email from the URL as a POST data
	request.body.username = request.param.email

	finish = (error, user, info) ->
		if error
			response.status 500
			return response.end JSON.stringify error

		if not user
			response.status info.ecode or 400
			return response.end JSON.stringify info

		request.logIn user, (error) ->
			if error then return next error
			response.end JSON.stringify user

	(passport.authenticate 'email-login', finish) request, response, next