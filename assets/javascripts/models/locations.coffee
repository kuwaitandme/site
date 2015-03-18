model = Backbone.Model.extend
	idAttribute: "_id"
	defaults:
		_id: null
		name: ''


module.exports = Backbone.Collection.extend
	model: model
	name: '[model:locations]'
	url: '/api/location'


	initialize: (@config) ->
		console.log @name, 'initializing'

		# Redirect fetch to our cached version of fetch
		@oldFetch = @fetch
		@fetch = (arg) -> if not @cachedFetch arg then @oldFetch arg

		# The sync event is triggerd by the fetch() function.
		@on 'sync', @setCache


	# Save the model into HTML5 localstorage
	setCache: (value) ->
		console.log self.name, 'caching location details'

		localStorage = window.app.controllers.localStorage
		localStorage.cache 'mod:locations', JSON.stringify value


	# A reroute of backbone's fetch which first checks in the browser's
	# localstorage for the collection before making a AJAX call
	cachedFetch: ->

		# Attempt to load from HTML5 localStorage
		localStorage = window.app.controllers.localStorage
		cache = localStorage.get 'mod:locations'
		if cache
			console.log @name, 'setting locations from cache'
			json = JSON.parse cache
			@set json
			return true

		# If nothing was cached then, signal to fetch from the API
		console.log @name, 'fetching from API'
		false