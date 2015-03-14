ajax         = (require 'app-helpers').ajax
localStorage = (require 'app-controllers').localStorage

model = Backbone.Model.extend
	defaults:
		_id: null
		count: 0
		name: ''
		children: [{
			_id: null
			name: ''
			count: 0
		}]


module.exports = Backbone.Collection.extend
	model: model

	initialize: (config) -> console.log '[model:categories] initializing'

	fetch: ->
		console.log '[model:categories] fetching'
		that = this
		# var localStorage = app.controllers.localStorage;

		# Attempt to load from HTML5 localStorage
		cache = localStorage.get('categories')
		if cache
			console.log '[model:categories] setting categories from cache'
			return @set JSON.parse(cache)

		if window.data.categories
			console.log '[model:categories] setting categories from window scope'
			return @set window.data.categories

		# If data wasn't cached, then request it by sending a AJAX request
		# and then caching the data
		$.ajax
			type: 'GET'
			url: app.config.host + '/api/category/'
			# dataType: 'json'
			async: false
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.log '[model:categories] fetching category details'
				that.set JSON.parse response

				# Cache the results
				console.log '[model:categories] caching category details'
				localStorage.cache 'categories', response

				# Signal any listeners that we are done loading this category
				that.trigger 'ajax:done', that

			error: (e) ->
				console.error '[model:categories] error fetching category details', e