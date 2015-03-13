controller = (request, response, next) ->
	response.contentType 'application/json'

	id = request.params.id
	resetToken = request.query.token or ''

	captachFail = (err, res) ->
		response.status 401
		response.end '{}'

	captachSuccess = (err) ->
		password = request.body.password
		repassword = request.body.repassword

		# Clean out the parameters
		if resetToken.length is not 24 or not (/^[0-9A-F]*$/i.test id)
			response.status 400
			return response.end 'bad_token'

		# Check if passwords match
		if password is not repassword
			response.status 400
			return response.end 'password_mismatch'

		# Check if password is too small
		if password.length < 5
			response.status 400
			return response.end 'password_small'

		# All good, so attempt to reset the password
		User = global.models.user
		User.resetPassword id, resetToken, password, (err, success) ->
			if err then throw err
			if not success
				response.status 400
				return response.end 'reset_fail'

			return response.end 'success'


	# Check the captcha, which then calls the function to reset the password
	reCaptcha.verify request, captachSuccess, captachFail