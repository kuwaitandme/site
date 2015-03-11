module.exports = Backbone.View.extend
	events:
		'click .submit': 'submit'


	initialize: (options) ->
		@$submit = @$ '.submit'
		@$spinner = @$ "#ajax-spinner"

		@listenTo @model, 'ajax:error', @ajaxError
		@on "close", @close


	render: ->
		# @spinner = new (app.views.components.spinner)


	# Checks all the required fields in that particular page and prevents the
	# page from scrolling if any of the fields are empty.
	validate: ->
		@$gcaptcha = $('#g-recaptcha-response')
		val = @$gcaptcha.val()
		if !val or val == ''
			@model.trigger 'post:error', 'Please fill in the captcha properly'
			return false
		true

	# Sends the AJAX request to the back-end
	submit: (event) ->
		event.preventDefault()
		if !@validate()
			return
		@$submit.hide()
		@$spinner.show()
		@model.uploadServer()


	ajaxError: (event) ->
		@$submit.show()
		@$spinner.hide()
		@model.trigger 'post:error', event.statusText

	close: ->
		@remove()
		@unbind()
		@stopListening()