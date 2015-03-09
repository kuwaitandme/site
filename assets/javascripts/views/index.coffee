components = require('./components')
pages = require('./pages')

# EXPLAIN THIS MODULE
#
# @type {Object}
module.exports =

	# Setup the different views. ie. Initialize the different controllers for
	# the header, currentView and other components.
	initialize: ->
		console.group '[view] initializing'

		# Cache some DOM variables
		@$body = $('body')
		@$ptMain = $('#pt-main')
		@$currentPage = $('#current-page')
		@$nextPage = $('#next-page')
		@$previousPage = $('#prev-page')
		@previousView = @nextView = null

		# Set local variables
		@views = pages
		@components = components

		# Render different components
		@header = new (components.header)(el: 'header')
		@messages = new (components.messages)(el: '#messages')

		# Get and initialize the main view
		view = window.viewid
		@setView view, url: document.URL
		console.groupEnd()
		return


	# Finds the view with the given name and returns it's object.
	#
	# @param  String          name  The name of the view to be found.
	# @return Backbone.View         The Backbone.View object of the view found.
	getView: (name) -> pages[name]


	# Set's the currentView with all the proper animations and DOM
	# manipulations.
	#
	# @param  String   view         A string containing the identifier of the
	#                               view that we must switch to.
	# @param  Object   arguments    An object containing properties that gets
	#                               passed on to the new view.
	# @param  Object   HistoryState An object that contains details about the
	#                               history event in context.
	setView: (view, args, HistoryState) ->
		console.debug '[view] setting view to \'' + view + '\' with history:', HistoryState
		that = this
		HistoryState = HistoryState or {}
		reverse = HistoryState.reverse or false
		historyIndex = HistoryState.index or 0

		# Clear any messages
		@messages.clear()

		# Get the view
		@currentViewName = view
		currentView = @getView(view)

		# Check if there was a view before
		if @currentView

			# Clean up the view before switching to the next one. Detach
			# all event handlers and signal the view to run any 'closing'
			# animations.
			@currentView.undelegateEvents()
			if @currentView.onLeave then @currentView.onLeave()

			console.log '[view] creating buffer page to hold new view'

			# Create the target page (next or previous), based on the 'reverse'
			# option. Here we make use of our two helper functions to properly
			# create the page while deleting any old ones and reusing recent
			# ones.
			$targetPage = undefined
			viewExists = false
			if not reverse @createNextPage historyIndex
			else viewExists = @createPreviousPage(historyIndex)

			# Find the target page. Which is the last child
			$targetPage = @$ptMain.find('.pt-page:last-child')

			if not viewExists
				# Get and set the HTML for the target page
				html = @fetchHTML(view, args.url)
				$targetPage.html html
				$targetPage.addClass view

				# Initialize the view for this page
				@currentView = new currentView
					args: args
					el: $targetPage
			else @currentView = @targetView

			# Signal the app to transition to the new page
			app.transition
				$targetPage: $targtPage
				reverse: reverse
		else
			console.log '[view] initializing first view'

			# Else load set the currentView directly without any transition
			# animations
			@currentView = new currentView(
				arguments: arguments
				el: '.pt-page-current')

		# Signal the header to update itself
		@header.update()

		# Attempt to cache the HTML
		app.cacheCurrentView()

		# Now render signal the view to manipulate the DOM. ###
		if not viewExists @currentView.render()
		else @currentView.$el.scrollTop @currentView.scrollPosition

		# Re-attach events to the view
		@currentView.undelegateEvents()
		@currentView.delegateEvents()

		# Reattach the event handlers for the router
		app.reattachRouter()

		# Recall google Analytics
		@googleAnalyticsSend()
		if that.currentView.postAnimation then that.currentView.postAnimation()
		return


	# [createNextPage description]
	#
	# @param  {[type]} historyIndex [description]
	createNextPage: (historyIndex) ->
		that = this
		$el = $('<div></div>').addClass('pt-page').data('index', historyIndex)
		@previousView = @currentView
		@previousView.scrollPosition = @currentView.$el.scrollTop()
		$('.pt-page').each ->
			$page = $(this)
			index = $page.data('index') or 0
			if index != historyIndex - 1
				$page.remove()
			return
		@$ptMain.append $el
		return


	# [createNextPage description]
	createPreviousPage: (historyIndex) ->
		that = this
		viewExists = false
		$el = $('<div></div>').addClass('pt-page').data('index', historyIndex)
		@nextView = @currentView
		@nextView.scrollPosition = @currentView.$el.scrollTop()
		$('.pt-page').each ->
			$page = $(this)
			index = $page.data('index') or 0
			if index != historyIndex + 1
				if index != historyIndex
					return $page.remove()
				$el = $page
				that.targetView = that.nextView
				viewExists = true
			return
		@$ptMain.append $el
		viewExists


	# Fetches the HTML for the given view and returns it. This function first
	# checks the local-storage if the view's HTML has been cached or not.
	# If the view has been cached, then it loads the HTML from it and returns.
	# If the view wasn't cached, then the function loads the HTML via a AJAX
	# request.
	fetchHTML: (view, url) ->
		console.log '[view] trying to find HTML in cache for view', view
		html = app.getCachedViewHTML(view)

		if html
			console.log '[view] HTML found from cache!'
			return html

		console.debug '[view] no HTML in cache, fetching HTML via AJAX', url
		$.ajax
			type: 'GET'
			url: url
			async: false
			success: (response) ->
				html = $(response).find('.html5-cache').html()
				return
			error: (e) ->
				console.error '[view] error sending GET request', e
				return
		html

	# Function to safely call the Google analytics script
	googleAnalyticsSend: ->
		if typeof ga != 'undefined' then ga 'send', 'pageview'