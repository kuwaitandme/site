views =
	"#page-begin":   require './part.begin'
	"#page-details": require './part.details'
	"#page-finish":  require './part.finish'
	"#page-images":  require './part.images'
	"#page-info":    require './part.info'
	"#page-maps":    require './part.maps'
	"#page-submit":  require './part.submit'

module.exports = Backbone.View.extend
	consoleSlug: '[view:classified-post]'
	views: {}

	model: new (app.models.classified)

	events: 'click a[data-page-nav]' : 'clickHandler'

	initialize: (options) ->
		console.log @consoleSlug, 'initializing'
		if options.$el then	@$el = options.$el

		that = @
		@listenTo @model, 'ajax:done', ->
			that.navigate '#page-finish', trigger: true
		@listenTo @model, 'post:error', @displayError


	render: ->
		console.log @consoleSlug, 'rendering'
		@navigate "#page-begin"

	checkRedirect: -> false

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

		event.preventDefault()
		that = @

		# If the view wasn't initialized already, initialize it
		options =
			el: href
			model: @model
		if not @views[href] then @views[href] = new views[href] options
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
			that.currentFragment = Backbone.history.fragment
			that.currentView = view
			that.currentView.render()
			that.currentView.$el.show().transition opacity: 1
		console.groupEnd()


	close: ->
		@$el.empty()
		@$el.off()
		@stopListening()