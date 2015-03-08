# App entry point for the 'Kuwait & Me' project. This has been such an amazing
# journey, although sad that I had to do it myself. This app that I have coded
# below relies heavily on Backbone.js, jQuery and Underscore. Hope it interests
# you to read through it..
#
# This file bootstraps the front-end app. Main JS execution begins here.
window.app =
	# This  starts up the app.
	start: ->
		console.group "[app] initializing"

		# Start attaching the module components here, so that other components
		# can refer to these modules by doing a 'app.modulename', since 'app'
		# is a global variable
		this.config = require "app-config"
		this.helpers = require "app-helpers"
		# this.libs = require "app-libs"

		# Initialize the controllers
		this.controllers = require "app-controllers"
		this.controllers.initialize this.config

		# Initialize the models
		this.models = require "app-models"
		this.models.initialize this.config

		# Initialize the views
		this.views = require "./views"
		this.views.initialize this.config

		console.groupEnd

	# Forward  to different app components. This way we can avoid
	# writing long names for s that are used often.
	goto: (url, view, args) ->
		@controllers.router.goto url, view, args
	reattachRouter: ->
		@controllers.router.reattachRouter()
	setView: (page, args, reverse) ->
		@views.setView(page, args, reverse)
	cacheCurrentView: ->
		@controllers.localStorage.cacheCurrentView()
	getCachedViewHTML: (view) ->
		@controllers.localStorage.getCachedViewHTML(view)
	transition: (options) ->
		@controllers.pageTransition.transition(options)
	loadResource: (resource) ->
		@controllers.resourceLoader.loadResource(resource)
	success: (text, title) ->
		@views.messages.success(text, title)
	error: (text, title) ->
		@views.messages.error(text, title)
	warn: (text, title) ->
		@views.messages.warn(text, title)


# Kick start the App. Start back-tracing the app's execution over here, if you
# are trying to understand my code.
$(document).ready( -> app.start())