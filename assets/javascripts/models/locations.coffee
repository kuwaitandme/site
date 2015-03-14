ajax = (require 'app-helpers').ajax

model = Backbone.Model.extend
	defaults:
		_id: null
		name: ''


module.exports = Backbone.Collection.extend
	model: model
	name: '[model:locations]'

	initialize: (@config) -> console.log @name, 'initializing'

	fetch: ->
		console.log @name, 'fetching'
		self = @

		localStorage = window.app.controllers.localStorage

		# Attempt to load from HTML5 localStorage
		cache = localStorage.get 'locations'
		if cache
			json = JSON.parse cache
			console.debug @name, 'setting locations from cache', json
			return @set json

		console.debug @name, 'requesting location details via AJAX'

		# If data wasn't cached, then request it by sending a AJAX request
		# and then caching the data
		$.ajax
			type: 'GET'
			url: app.config.host + '/api/location/'
			# dataType: 'json'
			async: false
			beforeSend: ajax.setHeaders
			success: (response) ->
				json = JSON.parse response
				console.debug self.name, 'got location details', json
				self.set json

				# Cache the results
				console.log self.name, 'caching location details'
				localStorage.cache 'locations', response

				# Signal any listeners that we are done loading this location
				self.trigger 'ajax:done', self

			error: (e) ->
				console.error self.name, 'error fetching location details', e