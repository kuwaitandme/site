# App entry point for the 'Kuwait & Me' project. This has been such an amazing
# journey, although sad that I had to do it myself. This app that I have coded
# below relies heavily on Backbone.js, jQuery and Underscore. Hope it interests
# you to read through it..
#
# This file bootstraps the front-end app. Main JS execution begins here.
class App
	constructor: ->
		console.log "[app] initializing"
		@config       = require "app-config"
		@controllers  = require "app-controllers"
		@helpers      = require "app-helpers"
		@libs         = require "app-libs"
		@models       = require "app-models"
		@views        = require "app-views"

		# Initialize the components
		@controllers.initialize this, @config
		@models.initialize      this, @config


	start: ->
		console.log "[app] starting"
		@models.start()
		@controllers.start()


	# Forward  to different app components. This way we can avoid
	# writing long names for functions that we will be using often.
	cacheView: (view, identifier) -> @controllers.localStorage.cacheView(view, identifier)
	error: (text, title) -> @views.messages.error(text, title)
	getCachedViewHTML: (view) -> @controllers.localStorage.getCachedViewHTML(view)
	goto: (url, view, args) -> @controllers.router.goto url, view, args
	loadResource: (resource) -> @controllers.resourceLoader.loadResource(resource)
	reattachRouter: -> @controllers.router.reattachRouter()
	setView: (page, args, reverse) -> @controllers.viewManager.setView(page, args, reverse)
	success: (text, title) -> @controllers.messages.success(text, title)
	transition: (options) -> @controllers.pageTransition.transition(options)
	warn: (text, title) -> @controllers.messages.warn(text, title)


# Protect the app from being re-initialized
if not window.app
	window.app = new App
	window.app.start()