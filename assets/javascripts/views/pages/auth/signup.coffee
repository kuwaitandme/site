login = require "./login"

module.exports = login.extend
	name: "[view:auth-signup]"

	start: (@options) ->
		console.debug @name, 'initializing', @options

		# Set the model. Here the model for the classified will be the currently
		# logged in user.
		@model = @resources.currentUser

		# Initialize DOM elements
		@$form        = @$ "#login-form"
		@$links       = @$ ".extra-links"
		@$messages    = @$ "#auth-messages"
		@$fullname    = @$ "#auth-fullname"
		@$password    = @$ "#auth-password"
		@$repassword  = @$ "#auth-repassword"
		@$spinner     = @$ "#ajax-spinner"
		@$submit      = @$ "#submit-div"
		@$username    = @$ "#auth-username"

		@setupCaptcha()


	continue: ->
		console.log @name, 'continuing'

		@$captcha.removeClass 'hide'
		@$submit.addClass 'hide'
		@renderCaptcha()
		@parseURL()


	captchaSuccess: (response) ->
		@$submit.removeClass 'hide'
		@$captcha.addClass 'hide'
		console.log @name, 'captcha success'


	# Validates the form before and displays any error messages if needed
	validate: ->
		status = true
		@removeAllErrors()

		isEmpty = (str) -> (str or "").trim().length == 0
		isSmall = (str) -> (str or "").trim().length < 5

		if isEmpty @$fullname.val()
			@showError @$fullname, 'Please give your full name'
			status = false
		if isEmpty @$username.val()
			@showError @$username, 'Please give an email'
			status = false
		if isEmpty @$password.val()
			@showError @$password, 'Please give a password'
			status = false
		else if isSmall @$password.val()
			@showError @$password, 'Password should be min. 5 letters'
			status = false
		else if isEmpty @$repassword.val()
			@showError @$repassword, 'Please re-enter your password'
			status = false
		else if @$password.val() != @$repassword.val()
			@showError @$repassword, 'Passwords don\'t match'
			status = false

		console.debug @name, 'form validation status:', status
		status


	# Sends the AJAX request to the back-end
	submit: (event) ->
		console.log @name, 'submitting form'
		event.preventDefault()
		self = @

		@removeMessages()
		@showLoading()

		# Validate the user fields
		if not @validate() then return @hideLoading()

		fields = {
			username:   @$username.val()
			password:   @$password.val()
			repassword: @$repassword.val()
			fullname:   @$fullname.val()
		}

		# Attempt to login the user
		@currentUser.signup fields, (error, response) ->
			# Hide the ajax loader
			self.hideLoading()

			if error
				switch error.responseJSON.status
					when 'invalid email/name'
						self.addMessage self.messages['bad_fields']
					when 'user already exists'
						self.addMessage self.messages['signup_userexists']
					else self.addMessage error.responseText

				self.$captcha.removeClass 'hide'
				self.$submit.addClass 'hide'
				self.resetCaptcha()
			else
				console.debug self.name, 'created user', response

				# Redirect to the account page on success
				app.trigger 'redirect', '/auth/login?success=signup_success'