ajax = (require 'app-helpers').ajax

model = Backbone.Model.extend
	defaults:
		_id: null
		name: ''


module.exports = Backbone.Collection.extend
	model: model
	name: '[model:locations]'
	url: '/api/location'


	initialize: (@config) ->
		console.log @name, 'initializing'

		# The sync event is triggerd by the fetch() function.
		@on 'sync', @setCache


	# Save the model into HTML5 localstorage
	setCache: (value) ->
		console.log self.name, 'caching location details'

		localStorage = window.app.controllers.localStorage
		localStorage.cache 'locations', JSON.stringify value


	# A reroute of backbone's fetch which first checks in the browser's
	# localstorage for the collection before making a AJAX call
	cachedFetch: ->
		console.log @name, 'fetching'

		# Attempt to load from HTML5 localStorage
		localStorage = window.app.controllers.localStorage
		cache = localStorage.get 'locations'
		if cache
			console.log @name, 'setting locations from cache'
			json = JSON.parse cache
			@set json

		# If nothing was cached then, signal to fetch from the API
		else @fetch()