login = require "./login"

module.exports = login.extend
	name: "[view:auth-signup]"

	renderCaptcha: ->
		console.log @name, 'setting captcha'

		@$captcha   = @$ "#signup-captcha"
		@$captcha.html("").show()
		grecaptcha.render "signup-captcha", sitekey: window.data.captchaKey


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		console.debug @name, 'form validation status', status
		status


	# Sends the AJAX request to the back-end
	submit: (event) ->
		console.log @name, 'submitting form'
		event.preventDefault()
		that = @

		@removeMessages()
		@resetCaptcha()
		@showLoading()

		# Validate the user fields
		if not @validate() then return

		fields = {
			username:   (@$ "[name='username']").val()
			password:   (@$ "[name='password']").val()
			repassword: (@$ "[name='repassword']").val()
			fullname:   (@$ "[name='fullname']").val()
		}

		# Attempt to login the user
		that.model.signup fields, (error, response) ->
			if error then switch error.status
				when 400
					that.addMessage 'There are invalid fields'
				when 406
					that.addMessage 'incorrect captcha'
				when 403
					that.addMessage 'That email is already in use'
			else
				console.debug that.name, 'created user', response

				# Redirect to the account page on success
				app.goto('/auth/login?success=signup_success', 'auth-login')

				# Hide the ajax loader
				that.hideLoading()