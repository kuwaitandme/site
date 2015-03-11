mongoose = require 'mongoose'
passport = require 'passport'
config = global.config

# Controller for the login page. Attempts to log the user in.
#
# If successful, redirect to the account page or else stay in the login page
# and display an error
controller = module.exports =
	get: (request, response, next) ->
		render = global.helpers.render
		render request, response,
			bodyid: 'auth-login'
			page: 'auth/login'
			title: response.__('title.auth.login')
			data:
				sitekey: config.reCaptcha.site


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