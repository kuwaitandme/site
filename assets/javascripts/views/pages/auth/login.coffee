helpers = require 'app-helpers'

view = require '../../mainView'
module.exports = view.extend
	name: "[view:auth-login]"

	events: 'click .submit': 'submit'

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


	start: (options) ->
		console.debug @name, 'initializing', options

		@model = app.models.currentUser

		# Initialize DOM elements
		@$form      = @$ "#login-form"
		@$links     = @$ ".extra-links"
		@$messages  = @$ "#auth-messages"
		@$password  = @$ "#auth-password"
		@$spinner   = @$ "#ajax-spinner"
		@$submit    = @$ ".submit"
		@$username  = @$ "#auth-username"

		# Parse the URL and give out the appropriate message based on it.
		getParam = app.helpers.url.getParam
		if getParam 'error'
			@addMessage @messages[getParam 'error'], 'error'
		if getParam 'success'
			@addMessage @messages[getParam 'success'], 'success'
		if getParam 'warn'
			@addMessage @messages[getParam 'warn'], 'warn'
		# if getParam 'warn'    then app.warn    @messages[getParam 'warn']

		# Generate a random id to put in place of the captcha's id
		randomId = Math.floor (Math.random() * 1000)
		@captchaId = 'gcaptcha' + randomId
		@$captcha = @$ '.gcaptcha'
		@$captcha.attr 'id', @captchaId

		console.log @captchaId

	continue: ->
		console.log @name, 'rendering'
		@renderCaptcha()


	renderCaptcha: ->
		console.log @name, 'setting captcha'
		@$captcha.html("").show()
		if @captcha then grecaptcha.reset @captcha
		else @captcha = grecaptcha.render @captchaId, sitekey: window.data.captchaKey


	resetCaptcha: -> grecaptcha.reset @captcha


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		console.debug @name, 'form validation status', status
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
	removeMessages: -> @$messages.html ""


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


	# Function to decide if this view should redirect to another view
	checkRedirect: -> false


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

		# Attempt to login the user
		that.model.login @$username.val(), @$password.val(), (error, response) ->
			# Hide the ajax loader
			that.hideLoading()

			if error then switch error.status
				when 404
					that.addMessage 'Your login is wrong'
				when 400
					that.addMessage 'There are invalid fields or the captcha has failed'
				when 406
					that.addMessage 'incorrect captcha'
				when 401
					that.addMessage "Your account is not activated, check your inbox (and junk mail) for the activation email", 'warning'
				when 403
					that.addMessage 'Your account has been banned'
					that.addMessage 'Admin message: '
			else
				console.debug that.name, 'received user', response

				# Redirect to the account page on success
				app.goto('/account/', 'account')
