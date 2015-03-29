if not window.App?

	window.App =

		# Views:  require "app-views"
		Router: (require "app-controllers").router
		Cache: (require "app-controllers").cache
		ViewManager: (require "app-controllers").viewManager

		Resources:
			Library: require "app-libs"
			Config: require "app-config"
			Models: require "app-models"
		instance: null


	class Main
		constructor: (App) ->
			@initializeResources()
			@initializeViews()
			@initializeListeners()
			@initializeBackBone()

		initializeViews: ->
			@viewManager = new App.ViewManager @resources

		initializeListeners: ->
			_.extend @, Backbone.Events


		initializeBackBone: ->
			# Rewrite backbone sync with our custom sync function. For now add our
			# little hack to bypass the CSRF token. NOTE that we must find another
			# way to have CSRF added into every AJAX call without having to making
			# more than one request.
			backboneSync = Backbone.sync
			newSync = (method, model, options) ->
				options.beforeSend = (xhr) ->
					# Set the captcha header
					captcha = ($ '[name="g-recaptcha-response"]').val()
					if captcha then xhr.setRequestHeader 'x-gcaptcha', captcha

					# Set the CSRF skipper
					xhr.setRequestHeader 'x-csrf-skipper'
				backboneSync method, model, options
			Backbone.sync = newSync

			# Start Backbone history to trigger the different routes and to load
			# the first route.
			Backbone.history.start
				pushState: true,
				hashChange: false,
				root: '/'


		initializeResources: ->
			@resources = App.Resources

			@resources.cache = new App.Cache
			@resources.categories = new App.Resources.Models.categories
			@resources.currentUser = new App.Resources.Models.user
			@resources.locations = new App.Resources.Models.locations
			@resources.router = new App.Router

			@resources.categories.resources = @resources
			@resources.locations.resources = @resources
			@resources.currentUser.resources = @resources

			@resources.categories.fetch()
			@resources.locations.fetch()
			@resources.currentUser.fetch()
	# App entry point for the- 'Kuwait & Me' project. This has been such an amazing
	# journey, although sad that I had to do it myself. This app that I have coded
	# below relies heavily on Backbone.js, jQuery and Underscore. Hope it interests
	# you to read through it..
	#
	# This file bootstraps the front-end app. Main JS execution begins here.
	# class Main
	# 	constructor: (App) ->
	# 		console.log "[app] initializing"

	# 		_.extend @, Backbone.Events

	# 		# Initialize the components
	# 		# @controllers.initialize this, @config
	# 		@models.initialize      this, @config
	# 		@controllers.models = @models

	# 		# Setup listeners
	# 		@setupListeners()

	# 	start: ->
	# 		console.log "[app] starting"

	# 		@models.start()
	# 		@controllers.start()

	# 	setupListeners: ->
	# 		self = @
	# 		@on 'redirect', (url) -> self.controllers.router.redirect url
	# 		@on 'router:refresh', -> self.controllers.router.reattachRouter()

	# 	# Forward  to different app components. This way we can avoid
	# 	# writing long names for functions that we will be using often.
	# 	# goto: (url, view, args) -> @controllers.router.goto url, view, args
	# 	# loadResource: (resource) -> @controllers.resourceLoader.loadResource resource
	# 	# reattachRouter: -> @controllers.router.reattachRouter()
	# 	# setView: (page, args, reverse) -> @controllers.viewManager.setView page, args, reverse
	# 	progress: (percent) -> @controllers.viewManager.progressBar.progress percent


	($ window).ready ->
		console.log '[foundation] initializing'
		$this = ($ document)
		$this.foundation()

		window.App.instance = new Main window.App
		# window.App.instance.start()

else console.log "[lib] app already defined. stopping re-execution of script"