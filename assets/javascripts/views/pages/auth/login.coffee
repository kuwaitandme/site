module.exports = Backbone.View.extend
	consoleSlug: "[view:auth-login]"

	events:
		'click .submit': 'submit'

	messages:
		activate_fail: 'Something went wrong while activating your account'
		activate_success: 'Your account is successfully activated'
		captchaFail: 'Please enter the captcha properly!'
		inactive: 'Your account is not activated! Check your inbox (and junk email) for an activation email'
		incorrect: 'Your login credentials are invalid'
		logout: 'You have been logged out successfully'
		need_login: 'You need to be logged in in to view that page'
		reset_error: 'Something went wrong while resetting your password'
		reset_password_mismatch: 'The passwords have to match'
		reset_password_small: 'The password is too small (min 6 characters)'
		reset_sent: 'Password reset has been sent to your email'
		reset_success: 'Your password has been reset'
		send_again: 'Your account is not activated, check your email'
		signup_fail: 'Something went wrong while registering you'
		signup_invalid: 'Some of the fields are invalid'
		signup_success: 'Your account has been created, Check your inbox (and junk email) for an activation email'
		signup_taken: 'That account name has already been taken!'


	initialize: ->
		console.log @consoleSlug, 'initializing'
		app.loadResource 'reCaptcha'

		# Initialize dom elements
		@$submit = @$el.find(".submit")
		@$captcha = @$el.find(".captcha-container")

		# Parse the URL and give out the appropriate message based on it.
		getParam = app.helpers.url.getParam
		if getParam('error') then app.error @messages[getParam('error')]
		if getParam('success') then app.success @messages[getParam('success')]
		if getParam('warn') then app.warn @messages[getParam('warn')]

		# Check for any server side flash messages
		flashErrors = window.data.flashError
		for error in flashErrors
			app.error @messages[error]


	render: ->
		console.log @consoleSlug, 'rendering'
		@resetCaptcha


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		console.debug @consoleSlug, 'form validation status', status
		status


	resetCaptcha: ->
		console.log @consoleSlug, 'setting captcha'
		@$captcha.show()
		# grecaptcha.reset
		# 	opt_widget_id: @el


	# Sends the AJAX request to the back-end
	submit: (event) ->
		console.log @consoleSlug, 'submitting form'
		event.preventDefault()
		if !@validate() then return

		# Hide the submit button, captcha and show the loader
		@$submit.hide()
		@$captcha.hide()
		@$spinner.fadeIn()


		# @model.uploadServer()