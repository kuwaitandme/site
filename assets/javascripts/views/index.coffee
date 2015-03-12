components = require('./components')
pages = require('./pages')


# EXPLAIN THIS MODULE
#
# @type {Object}
module.exports =
	consoleSlug: '[view]'

	# Setup the different views. ie. Initialize the different controllers for
	# the header, currentView and other components.
	initialize: ->
		console.group @consoleSlug, 'initializing'

		# Cache some DOM variables
		@$body           = $ 'body'
		@$currentPage    = $ '#current-page'
		@$nextPage       = $ '#next-page'
		@$previousPage   = $ '#prev-page'
		@$ptMain         = $ '#pt-main'

		# Set local variables
		@components = components
		@previousView = @nextView = null
		@views = pages

		# Render different components
		@header = new (components.header)(el: 'header')
		@messages = new (components.messages)(el: '#messages')

		# Get and initialize the main view
		view = window.viewid
		@setView view, url: document.URL
		console.groupEnd()


	# Set's the currentView with all the proper animations and DOM
	# manipulations.
	setView: (viewIdentifier, args, HistoryState) ->
		console.debug @consoleSlug,
			"setting view to '#{viewIdentifier}' with history:",  HistoryState

		# Change the mouse icon to the loader
		@displayMouseLoader(true)

		# Read the history state to see if we have to animate backwards or
		# forwards.
		HistoryState = HistoryState or {}
		reverse = HistoryState.reverse or false
		historyIndex = HistoryState.index or 0

		# Clear any messages
		@messages.clear()

		# Get the view
		@currentViewName = viewIdentifier
		currentView = @getView(viewIdentifier)

		# Check if there was a view before
		if @currentView
			# Clean up the view before switching to the next one. Detach
			# all event handlers and signal the view to run any 'closing'
			# animations.
			@currentView.undelegateEvents()
			if @currentView.onLeave then @currentView.onLeave()

			console.log @consoleSlug, 'creating buffer page to hold new view'

			# Create the target page (next or previous), based on the 'reverse'
			# option. Here we make use of our two helper functions to properly
			# create the page while deleting any old ones and reusing recent
			# ones.
			$targetPage = undefined
			viewExists = false
			if not reverse then @createNextPage historyIndex
			else viewExists = @createPreviousPage historyIndex

			# Find the target page. Which is the last child
			$targetPage = @$ptMain.find '.pt-page:last-child'

			if not viewExists
				# Get and set the HTML for the target page
				html = @fetchHTML viewIdentifier, args.url
				$targetPage.html html
				$targetPage.addClass viewIdentifier

				# Initialize the view for this page
				@currentView = new currentView
					args: args
					el: $targetPage

			else @currentView = @targetView

			# Check for any redirection
			if @currentView.checkRedirect() then return @currentView.doRedirect()

			# Signal the app to transition to the new page
			app.transition
				$targetPage: $targetPage
				reverse: reverse

		else
			console.log @consoleSlug, 'initializing first view'

			# Else load set the currentView directly without any transition
			# animations
			@currentView = new currentView
				args: args
				el: '.pt-page-current'

			# Check for any redirection
			if @currentView.checkRedirect() then return @currentView.doRedirect()

		# Attempt to cache the HTML
		app.cacheView @currentView, @currentViewName

		# Now render signal the view to manipulate the DOM. ###
		if not viewExists then @currentView.render()
		else @currentView.$el.scrollTop @currentView.scrollPosition

		# Re-attach events to the view
		@currentView.undelegateEvents()
		@currentView.delegateEvents()

		# Reattach the event handlers for the router
		app.reattachRouter()

		# Signal google Analytics
		@googleAnalyticsSend()

		# Run any post-animation functions
		if @currentView.postAnimation then @currentView.postAnimation()

		# Signal the header to update itself
		@header.update()

		# All done, set the mouse icon to normal
		@displayMouseLoader false


	# Create a page which will to used by the page animation to animate to.
	createNextPage: (historyIndex) ->
		$el = $('<div></div>')
			.addClass('pt-page')
			.data('index', historyIndex)

		# Paralyze current view and close the previous view
		@currentView.undelegateEvents()
		if @previousView then @previousView.trigger 'close'

		# Save the current view as the previous view and hopefully the garbage
		# collector will pick it up
		@previousView = @currentView
		@previousView.scrollPosition = @currentView.$el.scrollTop()

		# Delete any view that is not needed
		($ '.pt-page').each ->
			$page = $ this
			index = ($page.data 'index') or 0
			condition = historyIndex < index or index < historyIndex - 1

			if condition then $page.remove()

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
			console.debug @consoleSlug, "found previous view cached", @previousView

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
		console.log @consoleSlug, 'trying to find HTML in cache for view', view
		html = app.getCachedViewHTML view

		if html
			console.log @consoleSlug, 'HTML found from cache!'
			return html

		console.debug @consoleSlug, 'no HTML in cache, fetching HTML via AJAX', url
		$.ajax
			type: 'GET'
			url: url
			async: false
			success: (response) ->
				html = (($ response).find '.html5-cache').parent().html()
			error: (response) ->
				console.error @consoleSlug, 'error sending GET request', response
		html


	# Sets the mouse pointer to the loading icon.
	displayMouseLoader: (shown=true) -> ($ "body").toggleClass "wait", shown


	# Finds the view with the given name and returns it's object.
	getView: (viewIdentifier) -> pages[viewIdentifier]


	# Function to safely call the Google analytics script
	googleAnalyticsSend: -> if ga? then ga 'send', 'pageview'