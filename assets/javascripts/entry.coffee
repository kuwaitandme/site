if not window.app?
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

			_.extend @, Backbone.Events

			# Initialize the components
			@controllers.initialize this, @config
			@models.initialize      this, @config
			@controllers.models = @models

			# Setup listeners
			@setupListeners()

		start: ->
			console.log "[app] starting"

			@models.start()
			@controllers.start()

		setupListeners: ->
			self = @
			@on 'redirect', (url) -> self.controllers.router.redirect url
			@on 'router:refresh', -> self.controllers.router.reattachRouter()

		# Forward  to different app components. This way we can avoid
		# writing long names for functions that we will be using often.
		# goto: (url, view, args) -> @controllers.router.goto url, view, args
		# loadResource: (resource) -> @controllers.resourceLoader.loadResource resource
		# reattachRouter: -> @controllers.router.reattachRouter()
		# setView: (page, args, reverse) -> @controllers.viewManager.setView page, args, reverse
		progress: (percent) -> @controllers.viewManager.progressBar.progress percent

		error: (text, title) -> @controllers.messages.error text, title
		success: (text, title) -> @controllers.messages.success text, title
		warn: (text, title) -> @controllers.messages.warn text, title

	($ window).ready ->
		console.log '[foundation] initializing'
		# Foundation.set_namespace = ->
		$this = ($ document)
		$this.foundation()

		window.app = new App
		window.app.start()

else console.log "[lib] app already defined. stopping re-execution of script"