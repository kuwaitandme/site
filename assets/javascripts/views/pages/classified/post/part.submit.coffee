module.exports = Backbone.View.extend
	events: 'click .submit': 'submit'


	initialize: (options) ->
		@model = options.model
		if options.$el then	@$el = options.$el

		@$submit = @$ '.submit'
		@$spinner = @$ "#ajax-spinner"

		@listenTo @model, 'ajax:error', @ajaxError
		@on "close", @close

		# Generate a random id to put in place of the captcha's id
		randomId = Math.floor (Math.random() * 1000)
		@captchaId = 'gcaptcha' + randomId
		@$captcha = @$ '.gcaptcha'
		@$captcha.attr 'id', @captchaId


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
		console.log @name, 'setting captcha'
		@$captcha.html("").show()
		if @captcha then grecaptcha.reset @captcha
		else @captcha = grecaptcha.render @captchaId, sitekey: window.data.captchaKey


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