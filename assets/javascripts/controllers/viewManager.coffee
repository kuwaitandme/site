module.exports = class viewManager
	name: '[viewManager]'

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
		@$ptMain         = $ 'main'

		# Set local variables
		# @components = components
		@previousView = @nextView = null

		# Render different components
		@header = new (@components.header)(el: 'header')
		@messages = new (@components.messages)(el: '#messages')
		@progressBar = new @components.progressBar


	start: ->
		self = @

		# Attach different listeners
		@header.currentUser = @models.currentUser
		@models.currentUser.on 'sync', -> self.header.update()
		@router.on 'change', (args) -> self.routeHandle args


	routeHandle: (args={}) ->
		viewIdentifier = args.view
		historyState = args.state

		console.debug @name,
			"setting view to '#{viewIdentifier}' with history:",  historyState

		@setView viewIdentifier, historyState

		# Signal google Analytics
		@googleAnalyticsSend()

		# Signal the header to update itself
		@header.update()


	# Set's the currentView with all the proper animations and DOM
	# manipulations.
	setView: (viewIdentifier, historyState={}) ->
		# Change the mouse icon to the loader
		@displayMouseLoader true

		# Clear any messages
		# @messages.clear()		# Get the view

		# Check if there was a view before, and if there was then switch the pages
		if @currentView then @switchPages viewIdentifier, historyState
		else @initPage viewIdentifier, historyState

		# Attempt to cache the HTML for the view
		@localStorage.cacheView @currentView, @currentViewName

		# Attach the basic models to the view
		@currentView.currentUser = @models.currentUser
		@currentView.categories = @models.categories
		@currentView.locations = @models.locations

		# Check for any redirection
		if @currentView.checkRedirect()
			@progressBar.progress 100
			return @router.redirect @currentView.redirectUrl()

		# Now signal the view to manipulate the DOM.
		@currentView.trigger 'continue'

		# All done, set the mouse icon to normal
		@displayMouseLoader false
		@progressBar.progress 100


	initPage: (targetViewIdentifier, historyState) ->
		console.log @name, 'initializing first view'
		@currentViewName = targetViewIdentifier

		targetView = @getView targetViewIdentifier
		url = document.URL
		index = historyState.index

		$el = $ '.pt-page'
		$el.attr 'data-index', index
		$el.attr 'data-url', url

		# Else load set the currentView directly without any transition
		# animation
		@currentView = new targetView
			args: historyState
			el: ".pt-page[data-url='#{url}'][data-index='#{index}']"

		# Save the view in our buffer
		@viewBuffer.push @currentView

		# Start the view
		@currentView.trigger 'start'


	findTargetView: (historyState) ->
		console.log @name, "trying to find view in buffer"
		index = historyState.index
		url = document.URL

		for view in @viewBuffer
			if view? and view.$el? and
			(view.$el.data 'url') is url and
			(view.$el.data 'index') is index
				console.log @name, "view found in buffer. reusing view"
				return view


	createTargetView: (targetViewIdentifier, historyState) ->
		console.debug @name, "creating new view", targetViewIdentifier

		index = historyState.index
		url = document.URL#historyState.arguments.url

		$targetPage = $("<div data-url='#{url}' data-index='#{index}'></div>")
			.addClass('pt-page')
			.addClass(targetViewIdentifier)

		# Get and set the HTML for the target page
		html = @fetchHTML targetViewIdentifier, document.URL
		$targetPage.html html

		# Add the HTML into the DOM
		@$ptMain.append $targetPage

		view = @getView targetViewIdentifier
		targetView = new view
			args: historyState
			el: ".pt-page[data-url='#{url}'][data-index='#{index}']"

		# Save the view in our buffer and return
		@destroyUnwantedViews index
		@viewBuffer.push targetView
		return targetView


	destroyUnwantedViews: (historyIndex) ->
		index = 0
		for view in @viewBuffer
			if not view? or not view.$el? then continue
			viewIndex = Number view.$el.data 'index'

			# Destroy views that are in forward of history and those that are
			# to far behind in history.
			if viewIndex is historyIndex or (historyIndex - viewIndex) > 5
				@viewBuffer[index] = null
				view.trigger 'finish'
			index += 1

	switchPages: (targetViewIdentifier, historyState) ->
		# Clean up the view before switching to the next one. Detach
		# all event handlers and signal the view to run any 'closing'
		# animations.
		@currentViewName = targetViewIdentifier

		# Read the history state to see if we are moving backward or
		# forward.
		reverse = historyState.reverse or false

		# Pause current page
		@currentView.trigger 'pause'

		targetView = @findTargetView historyState

		if not targetView
			console.debug @name, "view not found", targetViewIdentifier

			# Create a new view
			targetView = @createTargetView targetViewIdentifier, historyState

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




	# Fetches the HTML for the given view and returns it. This function first
	# checks the local-storage if the view's HTML has been cached or not.
	# If the view has been cached, then it loads the HTML from it and returns.
	# If the view wasn't cached, then the function loads the HTML via a AJAX
	# request.
	fetchHTML: (view, url) ->
		console.log @name, 'trying to find HTML in cache for view', view
		html = @localStorage.getCachedViewHTML view

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