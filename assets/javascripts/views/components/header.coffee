module.exports = Backbone.View.extend
	sliderAnimateWidth: 200
	events:
		'click #grabber-hide': 'hide'
		'click #grabber-display': 'show'
		'click ul a': 'hide'


	initialize: (options) ->
		console.log '[view:header] initializing'

		# Initialize DOM variables
		@$navHome      = @$ '#nav-logo'
		@$navLinks     = @$ '.nav'
		@$nextLink     = @$ '.next'
		@$previousLink = @$ '.prev'
		@$sliderNav    = @$ '#slider-nav'

		@attachListeners()


	# This function attaches listeners throughout the app to the header
	attachListeners: ->
		@listenTo app.models.currentUser, 'loggedin', @update
		@listenTo app.models.currentUser, 'logout', @update


	# This function runs some methods and updates the header as per the current
	# page state
	update: ->
		routerController = app.controllers.router
		currentUser      = app.models.currentUser

		# Get the current view from the history API
		currentState = routerController.getHistoryState()
		currentView  = currentState.view

		# Add the 'active' class accordingly
		(@$ "[data-view] li").removeClass 'active'
		if currentView
			(@$ "[data-view='#{currentView}'] li").addClass 'active'

		# Depending on the user's current login state. Change the header
		if currentUser.isAnonymous() then @$el.removeClass 'loggedin'
		else @$el.addClass 'loggedin'