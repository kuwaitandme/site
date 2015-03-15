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
			console.log @name, 'setting locations from cache'
			json = JSON.parse cache
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
				if typeof response is not 'object'
					response = JSON.parse response

				console.log self.name, 'got location details from API'
				self.set response

				# Cache the results
				console.log self.name, 'caching location details'
				localStorage.cache 'locations', JSON.stringify response

				# Signal any listeners that we are done loading this location
				self.trigger 'ajax:done', self

			error: (e) ->
				console.error self.name, 'error fetching location details', e