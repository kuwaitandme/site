ajax = require('app-helpers').ajax

model = Backbone.Model.extend
	defaults:
		_id: null
		name: ''


module.exports = Backbone.Collection.extend(
	model: model

	initialize: (config) ->
		console.log '[model:locations] initializing'


	fetch: ->
		console.group '[model:locations] fetching'
		that = this
		localStorage = app.controllers.localStorage

		# Attempt to load from HTML5 localStorage
		cache = localStorage.get('locations')
		if cache
			console.log '[model:locations] setting locations from cache'
			console.groupEnd()
			return @set(JSON.parse(cache))

		# If data wasn't cached, then request it by sending a AJAX request
		# and then caching the data
		$.ajax
			type: 'GET'
			url: app.config.host + '/api/location/'
			dataType: 'json'
			async: false
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.log '[model:locations] fetching location details'
				that.set JSON.parse(response)

				# Cache the results
				console.log '[model:locations] caching location details'
				localStorage.cache 'locations', response

				# Signal any listeners that we are done loading this location
				that.trigger 'ajax:done', that
				console.groupEnd()
			error: (e) ->
				console.error '[model:locations] error fetching location details', e
				console.groupEnd()