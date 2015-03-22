# module.exports = Backbone.View.extend
# 	sliderAnimateWidth: 200
# 	template: template['header']
# 	events:
# 		'click #grabber-hide': 'hide'
# 		'click #grabber-display': 'show'
# 		'click ul a': 'hide'
# 		'click #nav-grabber' : 'toggleHeader'


# 	initialize: (options) ->
# 		console.log '[view:header] initializing'

# 		# Initialize DOM variables
# 		@$navHome      = @$ '#nav-logo'
# 		@$navLinks     = @$ '.nav'
# 		@$nextLink     = @$ '.next'
# 		@$previousLink = @$ '.prev'
# 		@$body         = $ 'body'
# 		@$sliderNav    = @$ '#slider-nav'

# 		@listenTo app.models.currentUser, 'sync', @update
# 		@render()


# 	render: ->
# 		@$el.html @template()
# 		@scrollHandler()


# 	toggleHeader: -> @$body.toggleClass 'show-header-sidebar'




module.exports = Backbone.View.extend
	sliderAnimateWidth: 200
	name: '[view:header]'
	events:
		'click #grabber-hide': 'hide'
		'click #grabber-display': 'show'
		'click ul a': 'hide'


	initialize: (options) ->
		console.log @name, 'initializing'

		# Initialize DOM variables
		@$navHome      = @$ '#nav-logo'
		@$navLinks     = @$ '.nav'
		@$nextLink     = @$ '.next'
		@$previousLink = @$ '.prev'
		@$sliderNav    = @$ '#slider-nav'

		@scrollHandler()
		# @update()


	scrollHandler: ->
		delta = 5
		didScroll = false
		lastScrollTop = 0
		navbarHeight = ($ 'header').outerHeight()

		# on scroll, let the interval function know the user has scrolled
		($ window).scroll (event) -> didScroll = true;


		hasScrolled = ->
			st = ($ this).scrollTop()

			# Make sure they scroll more than delta
			if Math.abs(lastScrollTop - st) <= delta then return

			# If they scrolled down and are past the navbar, add class .nav-up.
			# This is necessary so you never see what is "behind" the navbar.
			if (st > lastScrollTop and st > navbarHeight)
				# Scroll Down
				($ 'header')
				.removeClass 'nav-down'
				.addClass 'nav-up'

				($ 'body').removeClass 'show-header-sidebar'

			else
				# Scroll Up
				if st + ($ window).height() < ($ document).height()
					($ 'header')
					.removeClass 'nav-up'
					.addClass 'nav-down'

			lastScrollTop = st;

		# run hasScrolled() and reset didScroll status
		setInterval ->
			if didScroll
				hasScrolled()
				didScroll = false
		, 250



	# This function runs some methods and updates the header as per the current
	# page state
	update: ->
		console.log @name, 'updating header'
		routerController = app.controllers.router

		@$el.removeClass 'nav-up'

		# Get the current view from the history API
		currentState = routerController.getHistoryState()
		currentView  = currentState.view

		# Add the 'active' class accordingly
		(@$ "[data-view] li").removeClass 'active'
		if @currentView
			(@$ "[data-view='#{currentView}'] li").addClass 'active'

		# Depending on the user's current login state. Change the header
		if @currentUser.isAnonymous() then @$el.removeClass 'loggedin'
		else @$el.addClass 'loggedin'