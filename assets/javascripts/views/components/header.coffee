module.exports = Backbone.View.extend
	sliderAnimateWidth: 200
	events:
		'click #grabber-hide': 'hide'
		'click #grabber-display': 'show'
		'click ul a': 'hide'


	initialize: ->
		console.log '[view:header] initializing'

		# Initialize DOM variables
		@$main = $('main')
		@$sliderNav = @$el.find('#slider-nav')
		@$mainNav = @$el.find('#main-nav')
		@$navHome = @$mainNav.find('#nav-logo')
		@$navLinks = @$mainNav.find('.nav')
		@$nextLink = @$mainNav.find('.next')
		@$previousLink = @$mainNav.find('.prev')

		@opened = false


	# Hide the Slider. This function animates the mainbody back to it's
	# original position while at the same hiding the header sidebar.
	hide: ->
		if not @opened then return
		@opened = false
		console.log '[view:header] hiding sidebar'

		# Animate the header sidebar
		@$sliderNav.transition x: 1 * @sliderAnimateWidth

		# Animate the main-body back to it's original position.
		@$main.transition x: 0


	# Show the Slider. This function animates the mainbody to the left, to make
	# space for the header sidebar which animates from the right.
	show: ->
		if @opened then return
		@opened = true
		console.log '[view:header] displaying sidebar'

		# Animate the header sidebar
		@$sliderNav.transition x: 0

		# Animate the mainbody to move to the left.
		@$main.transition x: -1 * @sliderAnimateWidth


	# This function decides if the header should show the nav icons instead of
	# the main site logo. If we are in the homepage, then the sitelogo is
	# displayed, otherwise the nav-options are displayed.
	#
	# Also, this function forces the header to close. Usually this function is
	# called whenever you move to a new page, so in most cases the user will
	# want the header closed.
	update: ->
		that = @
		router = app.controllers.router

		@hide();

		# Get a condition to decide if we are in the homepage or not
		homepageCondition = document.URL.split('/').length <= 4

		# Decide if we have to show the logo or work on the nav controls
		if homepageCondition
			console.log '[view:header] showing site logo'
			@$navLinks.fadeOut -> that.$navHome.fadeIn()

		else
			console.log '[view:header] showing navigation controls'
			@$navHome.fadeOut -> that.$navLinks.fadeIn()
			@$previousLink.addClass 'active'
			@$nextLink.addClass 'active'
			if router.startingIndex >= router.historyIndex
				@$previousLink.removeClass 'active'
			if history.length <= router.historyIndex
				@$nextLink.removeClass 'active'