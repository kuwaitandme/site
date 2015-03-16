passport = require 'passport'

# Controller for the login page. Attempts to log the user in.
#
# If successful, redirect to the account page or else stay in the login page
# and display an error
module.exports = (request, response, next) ->
		response.contentType 'application/json'

		finish = (error, user, info) ->
			if error then  return next error
			if not user
				response.status info.ecode or 400
				return response.end JSON.stringify info

			request.logIn user, (error) ->
				if error then return next error
				response.end (JSON.stringify user)

		(passport.authenticate 'login', finish) request, response, next