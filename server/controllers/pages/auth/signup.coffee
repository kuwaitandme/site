passport = require('passport')

# Controller for the Signup page. Attempts to register the user in.
#
# If registration was successful, redirect to the classified posting page so
# that the user can start posting his/her classified.
controller = module.exports =
	get: (request, response, next) ->
		render = global.helpers.render
		render request, response,
			bodyid: 'auth-signup'
			page: 'auth/signup'
			title: response.__('title.auth.signup')

	# On POST request, use passport's authentication mechanism to register the
	# user
	post: (request, response, next) ->
		response.contentType 'application/json'

		finish (error, user, info) ->
			if error then  return next error
			if not user
				response.status info.ecode or 404
				return response.end()

			request.logIn user, (error) ->
				if error then return next error
				response.end (JSON.stringify user)

		(passport.authenticate 'login', finish) request, response, next
	# post: passport.authenticate('signup',
	# 	successRedirect: '/auth/login?success=signup_success'
	# 	failureRedirect: '/auth/signup'
	# 	failureFlash: true)