localStorage   = require './localStorage'
router         = require './router'
viewManager    = require './viewManager'

# Initializes each of the controllers one by one.
module.exports =
	consoleSlug: '[controller]'

	initialize: (app, config) ->
		console.log @consoleSlug, 'initializing'

		# Rewrite backbone sync with our custom sync function. For now add our
		# little hack to bypass the CSRF token. NOTE that we must find another
		# way to have CSRF added into every AJAX call without having to making
		# more than one request.
		backboneSync = Backbone.sync
		newSync = (method, model, options) ->
			options.beforeSend = (xhr) ->
				xhr.setRequestHeader 'x-csrf-skipper'
			backboneSync method, model, options
		Backbone.sync = newSync

		@localStorage   = new localStorage app, config
		@router         = new router app, config
		@viewManager    = new viewManager app, config

	start: ->
		console.log @consoleSlug, 'starting'
		@viewManager.start()