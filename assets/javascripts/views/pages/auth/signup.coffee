login = require "./login"


module.exports = login.extend
	consoleSlug: "[view:auth-signup]"

	renderCaptcha: ->
		console.log @consoleSlug, 'setting captcha'

		@$captcha   = @$ "#signup-captcha"
		@$captcha.html("").show()
		grecaptcha.render "signup-captcha", sitekey: window.data.captchaKey


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		console.debug @consoleSlug, 'form validation status', status
		status


	# Sends the AJAX request to the back-end
	submit: (event) ->
		console.log @consoleSlug, 'submitting form'
		event.preventDefault()
		that = @

		@removeMessages
		@showLoading()

		# Validate the user fields
		if not @validate() then return

		fields = {}

		# Attempt to login the user
		that.model.signup fields, (error, response) ->
			if error then switch error.status
				when 404
					that.addMessage 'Your login is wrong'
					# console.error that.consoleSlug, 'invalid user'
				when 400
					that.addMessage 'There are invalid fields or the captcha has failed'
				when 401
					that.addMessage "Your account is not activated, check your inbox (and junk mail) for the activation email", 'warning'
				when 403
					that.addMessage 'Your account has been banned'
					that.addMessage 'Admin message: '
			else
				console.debug that.consoleSlug, 'received user', response

				# Redirect to the account page on success
				app.goto('/auth/login?success="signup_success"', 'auth-login')

				# Hide the ajax loader
				that.hideLoading()