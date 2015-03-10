helpers = require 'app-helpers'
ajax = helpers.ajax
user = require("app-models").user

module.exports = Backbone.View.extend
	consoleSlug: "[view:auth-login]"

	model: new user

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

		# Initialize dom elements
		@$captcha = @$el.find ".captcha-container"
		@$form = @$el.find "#login-form"
		@$links = @$el.find ".extra-links"
		@$messages = @$el.find "#auth-messages"
		@$password = @$el.find "#auth-password"
		@$spinner = @$el.find "#ajax-spinner"
		@$submit = @$el.find ".submit"
		@$username = @$el.find "#auth-username"

		# Parse the URL and give out the appropriate message based on it.
		getParam = app.helpers.url.getParam
		if getParam('error') then app.error @messages[getParam('error')]
		if getParam('success') then app.success @messages[getParam('success')]
		if getParam('warn') then app.warn @messages[getParam('warn')]

		# Check for any server side flash messages
		flashErrors = window.data.flashError or []
		for error in flashErrors
			app.error @messages[error]


	render: ->
		console.log @consoleSlug, 'rendering'
		@resetCaptcha


	resetCaptcha: ->
		console.log @consoleSlug, 'setting captcha'
		@$captcha.show()
		# grecaptcha.reset
		# 	opt_widget_id: @el


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		console.debug @consoleSlug, 'form validation status', status
		status


	# Adds a message of a given type. Type can be 'success', 'error' or
	# 'warning'
	addMessage: (message, type='error') ->
		$el = $ "<li> #{message} </li>"
		$el.hide()
		$el.addClass type
		@$messages.append $el
		$el.fadeIn()


	# Removes all the messages from the message container
	removeMessages: ->
		@$messages.html ""


	# Shows the AJAX loader and hides parts of the login form like the submit
	# button, the captcha etc..
	showLoading: ->
		@$captcha.fadeOut()
		@$links.hide()
		@$spinner.fadeIn()
		@$submit.fadeOut()

	# Hides the AJAX loader and displays parts of the login form back
	hideLoading: ->
		@$captcha.stop().fadeIn()
		@$links.stop().show()
		@$spinner.stop().fadeOut()
		@$submit.stop().fadeIn()


	# Sends the AJAX request to the back-end
	submit: (event) ->
		console.log @consoleSlug, 'submitting form'
		event.preventDefault()
		that = @

		@removeMessages
		@showLoading()

		# Validate the user fields
		if not @validate() then return

		# Get the userdata
		data = {
			username: @$username.val(),
			password: @$password.val()
		}

		$.ajax
			type: 'POST'
			url: '/auth/login/'
			beforeSend: ajax.setHeaders
			data: data

			# This function gets called when the user successfully logs in
			success: (response) ->
				console.debug that.consoleSlug, response

				# Set the response in the user model
				that.model.set response

				app.goto('/account/', 'account')

				# Hide the ajax loader
				that.hideLoading()

			# This function handles the different errors that we might get
			# from the server
			error: (error) ->
				console.error that.consoleSlug, 'error logging in', error

				that.hideLoading()
				switch error.status
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