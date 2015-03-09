module.exports = Backbone.View.extend
	initialize: ->
		console.log '[view:auth] initializing'
		app.loadResource 'reCaptcha'

		# Parse the URL and give out the appropriate message based on it.

		getParam = app.helpers.url.getParam
		if getParam('error') then app.error @messages[getParam('error')]
		if getParam('success') then app.success @messages[getParam('success')]
		if getParam('warn') then app.warn @messages[getParam('warn')]

		# Check for any server side flash messages
		flashErrors = window.data.flashError
		if flashErrors
			i = 0
			while i < flashErrors.length
				app.error @messages[flashErrors[i]]
				i++

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

	render: ->
		console.log '[view:auth] rendering'