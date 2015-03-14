subViews =
	"#page-begin":   require './part.begin'
	"#page-details": require './part.details'
	"#page-finish":  require './part.finish'
	"#page-images":  require './part.images'
	"#page-info":    require './part.info'
	"#page-maps":    require './part.maps'
	"#page-submit":  require './part.submit'

view = (require '../../../mainView');
module.exports = view.extend
	consoleSlug: '[view:classified-post]'


	events: 'click a[data-page-nav]' : 'clickHandler'

	start: (options) ->
		console.debug @consoleSlug, 'initializing', options

		@model = new app.models.classified
		@views = {}

		that = @
		@currentView = null
		@listenTo @model, 'ajax:done', ->
			that.navigate '#page-finish', trigger: true
		@listenTo @model, 'post:error', @displayError
		@on "close", @close


	continue: ->
		console.log @consoleSlug, 'rendering', @el
		@navigate "#page-begin"


	# function to display an error message in the current view
	displayError: (message) ->
		@currentView.$el.find('ul.error-message')
			.hide()
			.append("<li>#{message}</li>")
			.fadeIn()


	# Function to get the view to navigate to from the anchor tag.
	clickHandler: (event) ->
		event.preventDefault()
		href = ($ event.currentTarget).attr 'href'
		@navigate(href)


	# Function to navigate to the view pointed by the href tag
	navigate: (href) ->
		console.log @consoleSlug, 'navigating to', href
		that = @

		options =
			el: @$ href
			model: @model

		# If the view wasn't initialized already, initialize it
		if not @views[href]
			console.debug @consoleSlug, 'initializing sub-view:', href
			subView = subViews[href]
			@views[href] = new subView options
			view = @views[href]
		else
			console.debug @consoleSlug, 'reusing sub-view:', href
			view = @views[href]

		console.debug @consoleSlug, 'going to sub-view:', view

		# Remove all error messages
		($ 'ul.error-message li').remove()

		# Set the current view variable
		if @currentView

			# If the view's validation function failed, stay in the same view
			if @currentView.validate and !@currentView.validate()
				return @navigate(@currentFragment, trigger: false)

			# Animate and switch the DOM elements
			$el = @currentView.$el
			console.debug @consoleSlug, 'animating previous view', view
			$el.transition { opacity: 0 }, ->
				$el.hide()
				that.currentFragment = Backbone.history.fragment
				that.currentView = view
				that.currentView.render()
				that.currentView.$el.show().transition opacity: 1
		else
			@currentFragment = Backbone.history.fragment
			@currentView = view
			@currentView.render()
			@currentView.$el.show().transition opacity: 1


	finish: ->
		# Signal every child view that it's time to close
		for view of @views
			@views[view].trigger "close"
			@views[view] = null

		@currentView = null
		@views = null

		@undelegateEvents()
		@remove()
		@unbind()