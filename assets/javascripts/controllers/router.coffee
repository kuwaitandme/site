module.exports = class controller
	constructor: (@config) ->
		@consoleSlug = '[controller:router]'
		console.log @consoleSlug, 'initializing'

		# Start HTML5 history
		@initializeHTML5history()

		# Start backbone history (Essential for Backbone routers).
		Backbone.history.start()


	# Initializes the HTML5 history API
	initializeHTML5history: ->
		that = this

		# Check if HTML5 history is available or not
		if typeof history.pushState == 'undefined'
			console.log @consoleSlug, 'HTML 5 History not available. Using fallback mode'
			return @fallback = true

		# Set defaults
		@historyIndex = window.history.length
		@startingIndex = @historyIndex
		@disabled = false

		# Trigger our pophistory function on the 'popstate' event
		($ window).bind 'popstate', (event) -> that.popHistory event

		# Modify the current history event to maintain consistency with
		# history pop events
		currentState =
			arguments: url: document.URL
			index: @historyIndex
			view: window.viewid
		history.replaceState currentState, '', document.URL


	# Properly returns the current HTML5 state
	getHistoryState: -> if @fallback then return {} else return history.state


	# Event handler to switch the view in the main page. This event gets
	# fired on anchor tag with the 'data-view' property set. The 'data-view'
	# contains the name of the view that we should look for, and the
	# href will contain the url which should be displayed in the browser.
	hrefEventHandler: (event) ->
		if @fallback and @disabled then return
		event.preventDefault()

		# Start collecting data
		$el = $(event.currentTarget)
		url = $el[0].href
		view = $el.data().view

		# Check if we are navigating to the same URL, in which case don't
		# navigate anywhere
		currentUrl = history.state and history.state.url or document.URL
		console.debug @consoleSlug, "moving from #{url} to #{currentUrl}"
		if url is currentUrl
			return console.error @consoleSlug, 'navigating to same page, preventing href'

		# Signal the app's view controllers to move to the new view ...
		console.group @consoleSlug, 'navigating to page:', view
		@goto url, view, null
		console.groupEnd()


	# Commands the app to load the given view, with the given URL.
	goto: (url, view, args) ->
		if @fallback then return window.location = url

		# Set the url in the arguments list
		args = args or {}
		args.url = url

		# Manually append the data for this request into the History API
		@pushHistory url, view, args

		# send the app to the view controller
		app.setView view, args, @currentState


	# Pushes the given url to the HTML5 history api.
	pushHistory: (url, view, args) ->
		if @fallback and @disabled then return

		# Add the url to the list of arguments if not set
		args = args or {}
		args.url = args.url or url

		@historyIndex += 1
		@currentState =
			arguments: args
			index: @historyIndex
			view: view

		console.debug @consoleSlug, 'HTML5 history push', @currentState
		history.pushState @currentState, @currentState.view, url


	# Handles the pop history event. Gets the state of the requested page from
	# the history API and then requests the app to set the view based on that
	# state.
	popHistory: (event) ->

		# Get the state of this history event. If there isn't any, then return
		currentState = history.state
		if not currentState then return

		# Check if we are moving forwards or backwards in time
		if currentState.index <= @historyIndex then currentState.reverse = true

		@historyIndex = currentState.index

		console.group @consoleSlug, 'HTML5 popstate'
		console.debug @consoleSlug, 'popstate event:', event
		console.debug @consoleSlug, 'popstate state:', currentState

		currentState.arguments = currentState.arguments or url: currentState.url
		app.setView currentState.view, currentState.arguments, currentState
		console.groupEnd()


	# Reattaches all the view links to use the given event handler. The handler
	# is only attached to anchor tag with the [data-view] attribute.
	reattachRouter: ->
		that = this
		console.log @consoleSlug, 'reattaching href event handlers'
		(($ 'a[data-view]').unbind 'click').bind 'click', (event) ->
			that.hrefEventHandler event