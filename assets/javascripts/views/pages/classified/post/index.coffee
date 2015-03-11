views =
	begin:   require './part.begin'
	details: require './part.details'
	finish:  require './part.finish'
	images:  require './part.images'
	info:    require './part.info'
	maps:    require './part.maps'
	submit:  require './part.submit'


router = Backbone.Router.extend
	views: {}
	routes:
		'page-begin': 'showPageBegin'
		'page-details': 'showPageDetails'
		'page-finish': 'showPageFinish'
		'page-images': 'showPageImages'
		'page-info': 'showPageInfo'
		'page-maps': 'showPageMaps'
		'page-submit': 'showPageSubmit'
		'*path': 'startup'


	initialize: (options) ->
		console.log '[view:classified-post] initializing router'
		@model = options.model
		@$el = options.$el

		@listenTo @model, 'ajax:done', @navigate 'page-finish', trigger: true
		@listenTo @model, 'post:error', @displayError


	close: ->
		# @$el.empty().off()
		# @stopListening()


	startup: ->
		console.log '[view:classified-post] redirecting to starting route'
		@showPageBegin()


	displayError: (message) ->
		@currentView.$el.find('ul.error-message').hide().append('<li>' + message + '</li>').fadeIn()


	switchPage: (viewname, el) ->
		that = this
		console.group '[view:classified-post] switching to page:', viewname
		console.debug '[view:classified-post]', @$el.find(el)

		# If the view wasn't initialized already, initialize it
		if !@views[viewname]
			@views[viewname] = new (views[viewname])(
				el: el
				model: @model)
		view = @views[viewname]
		console.debug '[view:classified-post] using sub-view:', view

		# Remove all error messages
		$('ul.error-message li').remove()

		# Set the current view variable
		if @currentView

			# If the view's validation function failed, stay in the same view
			if @currentView.validate and !@currentView.validate()
				return @navigate(@currentFragment, trigger: false)

			# Animate and switch the DOM elements
			$el = @currentView.$el
			console.debug '[view:classified-post] animating previous view', view
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

	showPageBegin:   -> @switchPage 'begin', '#page-begin'
	showPageDetails: -> @switchPage 'details', '#page-details'
	showPageFinish:  -> @switchPage 'finish', '#page-finish'
	showPageImages:  -> @switchPage 'images', '#page-images'
	showPageInfo:    -> @switchPage 'info', '#page-info'
	showPageMaps:    -> @switchPage 'maps', '#page-maps'
	showPageSubmit:  -> @switchPage 'submit', '#page-submit'


module.exports = Backbone.View.extend
	model: new (app.models.classified)

	initialize: (options) ->
		console.log '[view:classified-post] initializing'
		if options.$el then	@$el = options.$el


	render: ->
		console.log '[view:classified-post] rendering'

		# I really don't like to do this.. but Backbone refuses to creat
		# multiple instances of this router and new ones don't have any effect.
		# This hack is abit dirty and a solution should be found soon
		if not window.router?
			window.router = new router(
				$el: @$el
				model: @model)
		else
			window.router.$el = @$el
			window.router.model = @model
			window.router.views = []
		window.router.startup()

	checkRedirect: -> false

	close: ->
		@$el.empty()
		@$el.off()
		@stopListening()
		@router.close()