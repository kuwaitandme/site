subViews =
	"#page-begin":   require './part.begin'
	"#page-details": require './part.details'
	"#page-finish":  require './part.finish'
	"#page-images":  require './part.images'
	"#page-info":    require './part.info'
	"#page-maps":    require './part.maps'
	"#page-submit":  require './part.submit'


module.exports = (require '../../../mainView').extend
	name: '[view:classified-post]'
	title: -> "Post a classified"

	events: 'click a[data-page-nav]' : 'clickHandler'

	start: (@options) ->
		console.debug @name, 'initializing', @options

		# Initialize local variables
		@views = {}
		@currentView = null

		@on "close", @close


	continue: ->
		@getModel()

		# Setup listeners and event handlers
		@listenTo @model, 'ajax:done', @onAjaxSuccess
		@listenTo @model, 'post:error', @displayError

		console.log @name, 'rendering', @el
		@navigate "#page-begin"


	getModel: -> if not @model? then @model = new app.models.classified

	pause: -> (@$ '#g-recaptcha-response').remove()


	# On successful AJAX request to the server navigate to the finish page.
	onAjaxSuccess: -> @navigate '#page-finish', trigger: true


	# function to display an error message in the current view
	displayError: (message) ->
		@currentView.$el.find('ul.error-message')
			.hide()
			.append "<li>#{message}</li>"
			.fadeIn()


	# Function to get the view to navigate to from the anchor tag.
	clickHandler: (event) ->
		event.preventDefault()
		href = ($ event.currentTarget).attr 'href'
		@navigate href


	# Function to navigate to the view pointed by the href tag
	navigate: (href) ->
		console.log @name, 'navigating to', href
		that = @

		options =
			el: @$ href
			model: @model

		# If the view wasn't initialized already, initialize it
		if not @views[href]
			console.debug @name, 'initializing sub-view:', href
			subView = subViews[href]
			@views[href] = new subView options
			view = @views[href]
		else
			console.debug @name, 'reusing sub-view:', href
			view = @views[href]

		console.debug @name, 'going to sub-view:', view

		# Remove all error messages
		($ 'ul.error-message li').remove()

		# If there was a view before this, then performs some tasks before
		# transitioning to the next view
		if @currentView

			# If the view's validation function failed, stay in the same view
			if @currentView.validate? and !@currentView.validate()
				return #@navigate(@currentFragment, trigger: false)

			# Animate, render and switch the DOM elements
			$el = @currentView.$el
			console.debug @name, 'animating previous view', view
			$el.transition { opacity: 0 }, ->
				$el.hide()
				that.currentView = view
				that.currentView.render()
				that.currentView.$el.show().transition opacity: 1
		else
			# This is the first view, so set the view variable
			@currentView = view
			@currentView.render()
			@currentView.$el.show().transition opacity: 1


	# This function not only cleans up this view, but it also cleans up the
	# subsequent child views as well.
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