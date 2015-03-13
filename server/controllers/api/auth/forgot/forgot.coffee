module.exports = (request, response, next) ->

	captachFail = (err, res) ->
		response.status 401
		response.end 'captchafail'

	captachSuccess = (err) ->
		email = request.body.email

		# Check if email is valid
		reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if not reEmail.test email
			response.status 400
			response.end 'bademail'


		# Generate the reset token and send the email
		User = global.models.user
		User.createResetToken email, (err, user) ->
			if err then throw err
			if not user
				response.status 400
				return response.end 'usernotfound'

			# Send reset email
			Email.sendTemplate user.email, 'passwdreset',
				subject: 'Reset your password'
				user: user

			response.end 'resetsent'

	# Check the captcha
	reCaptcha.verify request, captachSuccess, captachFail