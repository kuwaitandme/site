# App entry point for the 'Kuwait & Me' project. This has been such an amazing
# journey, although sad that I had to do it myself. This app that I have coded
# below relies heavily on Backbone.js, jQuery and Underscore. Hope it interests
# you to read through it..
#
# This file bootstraps the front-end app. Main JS execution begins here.
window.app =
	# This  starts up the app.
	start: ->
		console.log "[app] initializing"

		# Start attaching the module components here, so that other components
		# can refer to these modules by doing a 'app.modulename', since 'app'
		# is a global variable
		@config = require "app-config"
		@helpers = require "app-helpers"
		@libs = require "app-libs"

		# Initialize the controllers
		@controllers = require "app-controllers"
		@controllers.initialize @config

		# Initialize the models
		@models = require "app-models"
		@models.initialize @config

		@currentUser = new @models.user
		@currentUser.fetch()

		# Initialize the views
		@views = require "./views"
		@views.initialize @config


	# Forward  to different app components. This way we can avoid
	# writing long names for functions that we will be using often.
	cacheView: (view, identifier) -> @controllers.localStorage.cacheView(view, identifier)
	error: (text, title) -> @views.messages.error(text, title)
	getCachedViewHTML: (view) -> @controllers.localStorage.getCachedViewHTML(view)
	goto: (url, view, args) -> @controllers.router.goto url, view, args
	loadResource: (resource) -> @controllers.resourceLoader.loadResource(resource)
	reattachRouter: -> @controllers.router.reattachRouter()
	setView: (page, args, reverse) -> @views.setView(page, args, reverse)
	success: (text, title) -> @views.messages.success(text, title)
	transition: (options) -> @controllers.pageTransition.transition(options)
	warn: (text, title) -> @views.messages.warn(text, title)


# Kick start the App. Start back-tracing the app's execution over here, if you
# are trying to understand my code.
$(window).load( -> app.start())