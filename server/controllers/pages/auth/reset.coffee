controller = module.exports =
	get: (request, response, next) ->
		id = request.params.id
		resetToken = request.query.token or ''

		# Clean out the parameters
		if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
			return next()

		render = global.helpers.render
		render request, response,
			bodyid: 'auth-reset'
			page: 'auth/reset'
			title: response.__('title.auth.reset')


	post: (request, response, next) ->
		id = request.params.id
		resetToken = request.query.token or ''

		captachFail = (err, res) ->
			response.redirect "/auth/reset/#{id}?token=#{resetToken}&error=captchafail"

		captachSuccess = (err) ->
			password = request.body.password
			repassword = request.body.repassword

			# Clean out the parameters
			if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
				return next()

			# Check if passwords match
			if password != repassword
				return response.redirect('/auth/reset/' + id + '?token=' + resetToken + '&error=reset_password_mismatch')

			# Check if password is too small
			if password.length < 5
				return response.redirect('/auth/reset/' + id + '?token=' + resetToken + '&error=reset_password_small')

			# All good, so attempt to reset the password
			User = global.models.user
			User.resetPassword id, resetToken, password, (err, success) ->
				if err then throw err
				if !success then response.redirect '/auth/login?error=reset_fail'
				else then response.redirect '/auth/login?success=reset_success'

		# Check the captcha, which then calls the function to reset the password
		reCaptcha.verify request, captachSuccess, captachFail