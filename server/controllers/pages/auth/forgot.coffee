config = global.config

controller = module.exports =
	get: (request, response, next) ->
		render = global.helpers.render
		render request, response,
			bodyid: 'auth-forgot'
			page: 'auth/forgot'
			title: response.__('title.auth.forgot')
			data:
				sitekey: config.reCaptcha.site


	post: (request, response, next) ->

		captachFail = (err, res) -> response.redirect '/auth/forgot?error=captchaFail'

		captachSuccess = (err) ->
			email = request.body.email

			# Check if email is valid
			reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if not (reEmail.test email) then return next()

			# Generate the reset token and send the email
			User = global.models.user
			User.createResetToken email, (err, user) ->
				if err then throw err
				if not user then return

				# Send reset email
				Email.sendTemplate user.email, 'passwdreset',
					subject: 'Reset your password'
					user: user

			# Redirect to a success page regardless of if the password
			# reset was sent or not. This makes it harder for a person to
			# guess if an email is saved in the database or not
			response.redirect '/auth/login?success=reset_sent'

		# Check the captcha, which then calls the function to login the user
		reCaptcha.verify request, captachSuccess, captachFail