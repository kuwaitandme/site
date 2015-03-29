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
		@$header       = $ 'header'
		@$sliderNav    = @$ '#slider-nav'
		@$credits      = @$ '.user-credits .count'
		@$username     = @$ '.user-title .name'
		@$userthumb    = @$ '.user-thumb img'

		@scrollHandler()
		# @update()

	populateHeader: ->
		md5 = App.Resources.Library.md5
		currentUser = App.Resources.currentUser

		md5Hash = md5 (currentUser.get 'email') or ''
		gravatarURL = "https://www.gravatar.com/avatar/#{md5Hash}"

		@$credits.html currentUser.get 'credits'
		@$username.html currentUser.get 'name'
		@$userthumb.attr 'src', gravatarURL


	scrollHandler: ->
		self = @

		delta = 5
		didScroll = false
		lastScrollTop = 0
		navbarHeight = @$header.outerHeight()
		# on scroll, let the interval function know the user has scrolled
		($ window).scroll (event) -> didScroll = true;
		($ window).resize (event) -> didScroll = true;

		hasScrolled = ->
			st = ($ this).scrollTop()
			# Make sure they scroll more than delta
			if Math.abs(lastScrollTop - st) <= delta and st is not 0 then return

			# If they scrolled down and are past the navbar, add class .nav-up.
			# This is necessary so you never see what is "behind" the navbar.
			if (st > lastScrollTop and st > navbarHeight)
				# Scroll Down
				self.$header.addClass 'nav-up'

			# Scroll Up
			else if st + ($ window).height() < ($ document).height()
				self.$header.removeClass 'nav-up'

			# 'Scroll up' if the window has been resized and the header has hit
			# the top..
			if st is 0 then self.$header.removeClass 'nav-up'

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
		routerController = App.Resources.router

		@$el.removeClass 'nav-up'

		# Get the current view from the history API
		currentState = routerController.getHistoryState()
		currentView  = currentState.view

		# Add the 'active' class accordingly
		(@$ "[data-view] li").removeClass 'active'
		if @currentView
			(@$ "[data-view='#{currentView}'] li").addClass 'active'

		# Depending on the user's current login state. Change the header
		if App.Resources.currentUser.isAnonymous() then @$el.removeClass 'loggedin'
		else @$el.addClass 'loggedin'

		@populateHeader()