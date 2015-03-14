module.exports = class viewManager
	name: '[controller:viewManager]'

	components:  (require 'app-views').components
	pages:       (require 'app-views').pages

	viewBuffer: []

	# Setup the different views. ie. Initialize the different controllers for
	# the header, currentView and other components.
	constructor: (@config) ->
		console.log @name, 'initializing'

		# Cache some DOM variables
		@$body           = $ 'body'
		@$currentPage    = $ '#current-page'
		@$nextPage       = $ '#next-page'
		@$previousPage   = $ '#prev-page'
		@$ptMain         = $ '#pt-main'

		# Set local variables
		# @components = components
		@previousView = @nextView = null


	start: ->
		# Render different components
		@header = new (@components.header)(el: 'header')
		@messages = new (@components.messages)(el: '#messages')

		# Get and initialize the main view
		view = window.viewid
		historyState = app.controllers.router.getHistoryState()
		@setView view, url: document.URL, historyState


	# Set's the currentView with all the proper animations and DOM
	# manipulations.
	setView: (viewIdentifier, args, historyState={}) ->
		console.debug @name,
			"setting view to '#{viewIdentifier}' with history:",  historyState

		# Change the mouse icon to the loader
		@displayMouseLoader(true)

		# Clear any messages
		@messages.clear()		# Get the view

		# Check if there was a view before, and if there was then switch the pages
		if @currentView then @switchPages(viewIdentifier, args, historyState)
		else @initPage(viewIdentifier, args, historyState)

		# Attempt to cache the HTML
		app.cacheView @currentView, @currentViewName

		# Check for any redirection
		if @currentView.checkRedirect()
			return @currentView.trigger 'redirect'

		# Now signal the view to manipulate the DOM.
		@currentView.trigger 'continue'

		# Reattach the event handlers for the router
		app.reattachRouter()

		# Signal google Analytics
		@googleAnalyticsSend()

		# Signal the header to update itself
		@header.update()

		# All done, set the mouse icon to normal
		@displayMouseLoader false


	initPage: (targetViewIdentifier, args, historyState) ->
		console.log @name, 'initializing first view'
		@currentViewName = targetViewIdentifier

		targetView = @getView targetViewIdentifier
		historyIndex = historyState.index

		$el = $ '.pt-page'
		$el.attr 'data-index', historyIndex

		# Else load set the currentView directly without any transition
		# animation
		@currentView = new targetView
			args: args
			el: ".pt-page[data-index='#{historyIndex}']"

		# Save the view in our buffer
		@viewBuffer.push @currentView

		# Start the view
		@currentView.trigger 'start'


	findTargetView: (historyIndex) ->
		console.log @name, "trying to find view in buffer"
		for view in @viewBuffer
			if (view.$el.data 'index') is historyIndex
				console.log @name, "view found in buffer. reusing view"
				return view


	createTargetView: (targetViewIdentifier, args, historyIndex) ->
		console.debug @name, "creating new view", targetViewIdentifier

		$targetPage = $("<div data-index='#{historyIndex}'></div>")
			.addClass('pt-page')
			.addClass(targetViewIdentifier)

		# Get and set the HTML for the target page
		html = @fetchHTML targetViewIdentifier, args.url
		$targetPage.html html

		# Add the HTML into the DOM
		@$ptMain.append $targetPage

		view = @getView targetViewIdentifier
		targetView = new view
			args: args
			el: ".pt-page[data-index='#{historyIndex}']"

		# Save the view in our buffer and return
		@viewBuffer.push targetView
		return targetView


	switchPages: (targetViewIdentifier, args, historyState) ->
		# Clean up the view before switching to the next one. Detach
		# all event handlers and signal the view to run any 'closing'
		# animations.
		self = @
		@currentViewName = targetViewIdentifier

		# Read the history state to see if we are moving backward or
		# forward.
		reverse = historyState.reverse or false
		historyIndex = historyState.index or 0

		# Pause current page
		@currentView.trigger 'pause'

		targetView = @findTargetView historyIndex

		if not targetView
			console.debug @name, "view not found", targetViewIdentifier

			# Create a new view
			targetView = @createTargetView targetViewIdentifier, args, historyIndex

			# start target view
			targetView.trigger 'start'

		@currentView = targetView

		# # Pause the current view
		# @currentView.trigger 'pause', ->
		# 	# _.bind self, @
		# 	self.currentView.$el.hide()
		# console.log @name, 'creating buffer page to hold new view'

		# # Create the target page (next or previous), based on the 'reverse'
		# # option. Here we make use of our two helper functions to properly
		# # create the page while deleting any old ones and reusing recent
		# # ones.
		# $targetPage = undefined
		# viewExists = false
		# if not reverse then @createNextPage targetView, historyIndex
		# # else viewExists = @createPreviousPage historyIndex

		# # Find the target page. Which is the last child
		# $targetPage = @$ptMain.find '.pt-page:last-child'

		# if not viewExists
		# 	# Get and set the HTML for the target page
		# 	html = @fetchHTML targetView, args.url
		# 	$targetPage.html html
		# 	$targetPage.addClass targetView

		# 	# Initialize the view for this page
		# 	@currentView = new targetView
		# 		args: args
		# 		el: $targetPage

		# else @currentView = @targetView

		# # Check for any redirection
		# if @currentView.checkRedirect()
		# 	return @currentView.trigger 'redirect'


	# Create a page which will to used by the page animation to animate to.
	createNextPage: (targetView, historyIndex) ->
		$el = $('<div></div>')
			.addClass('pt-page')
			.data('index', historyIndex)

		# if @previousView then @previousView.trigger 'close'

		# Save the current view as the previous view and hopefully the garbage
		# collector will pick it up
		@previousView = @currentView

		# Delete any view that is not needed
		# ($ '.pt-page').each ->
		# 	$page = $ this
		# 	index = ($page.data 'index') or 0
		# 	condition = historyIndex < index or index < historyIndex - 1

		# 	if condition then $page.remove()

		@$ptMain.append $el


	# Creates a page so that the page animation can work properly. This
	# function is abit special in that it checks if there was a view saved
	# when the app moved to the next page; If there was a view, then the
	# function prepares it to be loaded in the animation. Otherwise it creates
	# a blank view.
	#
	# The view to be instantiated is set at the this.targetView variable.
	createPreviousPage: (historyIndex) ->
		viewExists = false

		$el = $('<div></div>')
			.addClass('pt-page')
			.data('index', historyIndex)

		# Save the current view as the next page
		@nextView = @currentView
		@nextView.scrollPosition = @currentView.$el.scrollTop()

		# If there was a view already set before this, then use that instead of
		# creating a new one
		if @previousView
			console.debug @name, "found previous view cached", @previousView

			$el = @previousView.$el.data 'index', historyIndex
			@targetView = @previousView
			viewExists = true

			# Set this to null since we will only be storing one 'previousView'
			@previousView = null

		# Delete any view that is out of range
		($ '.pt-page').each ->
			$page = $ this
			index = ($page.data 'index') or 0
			condition = not (historyIndex >= index < historyIndex + 1)

			if condition then $page.remove()

		@$ptMain.append $el
		viewExists


	# Fetches the HTML for the given view and returns it. This function first
	# checks the local-storage if the view's HTML has been cached or not.
	# If the view has been cached, then it loads the HTML from it and returns.
	# If the view wasn't cached, then the function loads the HTML via a AJAX
	# request.
	fetchHTML: (view, url) ->
		console.log @name, 'trying to find HTML in cache for view', view
		html = app.getCachedViewHTML view

		if html
			console.log @name, 'HTML found from cache!'
			return html

		console.debug @name, 'no HTML in cache, fetching HTML via AJAX', url
		$.ajax
			type: 'GET'
			url: url
			async: false
			success: (response) ->
				html = (($ response).find '.html5-cache').parent().html()
			error: (response) ->
				console.error @name, 'error sending GET request', response
		html


	# Sets the mouse pointer to the loading icon.
	displayMouseLoader: (shown=true) -> ($ "body").toggleClass "wait", shown


	# Finds the view with the given name and returns it's object.
	getView: (viewIdentifier) -> @pages[viewIdentifier]


	# Function to safely call the Google analytics script
	googleAnalyticsSend: -> if ga? then ga 'send', 'pageview'