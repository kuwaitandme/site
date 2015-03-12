module.exports = Backbone.View.extend
	events:
		'click .submit': 'submit'


	initialize: (options) ->
		@$submit = @$ '.submit'
		@$spinner = @$ "#ajax-spinner"

		@listenTo @model, 'ajax:error', @ajaxError
		@on "close", @close


	render: -> @renderCaptcha()
		# @spinner = new (app.views.components.spinner)


	# Checks all the required fields in that particular page and prevents the
	# page from scrolling if any of the fields are empty.
	validate: ->
		val = ($ '#g-recaptcha-response').val()

		if not val or val == ''
			@model.trigger 'post:error', 'Please fill in the captcha properly'
			return false
		true

	# Sends the AJAX request to the back-end
	submit: (event) ->
		event.preventDefault()
		if not @validate() then return

		@$submit.hide()
		@$spinner.show()
		@model.uploadServer()


	renderCaptcha: ->
		console.log @consoleSlug, 'setting captcha'

		@$captcha   = @$ "#post-captcha"
		@$captcha.html("").show()
		@captcha = grecaptcha.render "post-captcha", sitekey: window.data.captchaKey


	resetCaptcha: -> grecaptcha.reset @captcha


	ajaxError: (event) ->
		@$submit.show()
		@$spinner.hide()
		@resetCaptcha()
		@model.trigger 'post:error', event.statusText

	close: ->
		@remove()
		@unbind()
		@stopListening()