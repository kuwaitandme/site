ajax = require('app-helpers').ajax
localStorage = require('app-controllers').localStorage

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

	initialize: (config) ->
		console.log '[model:categories] initializing'

	fetch: ->
		console.group '[model:categories] fetching'
		that = this
		# var localStorage = app.controllers.localStorage;

		# Attempt to load from HTML5 localStorage
		cache = localStorage.get('categories')
		if cache
			console.log '[model:categories] setting categories from cache'
			console.groupEnd()
			return @parseFetchResponse(JSON.parse(cache))

		# If data wasn't cached, then request it by sending a AJAX request
		# and then caching the data
		$.ajax
			type: 'GET'
			url: app.config.host + '/api/category/'
			dataType: 'json'
			async: false
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.log '[model:categories] fetching category details'
				that.parseFetchResponse response

				# Cache the results
				console.log '[model:categories] caching category details'
				localStorage.cache 'categories', JSON.stringify(response)

				# Signal any listeners that we are done loading this category
				that.trigger 'ajax:done', that

			error: (e) ->
				console.error '[model:categories] error fetching category details', e
				console.groupEnd()


	# This function parses the response and saves it into the collection
	# properly
	parseFetchResponse: (response) ->
		@set JSON.parse(response.categories)
		@setCounters JSON.parse(response.count)
		console.groupEnd()


	# Appends the counters into each of the category respectively
	setCounters: (counters) ->
		console.log '[model:categories] setting counters to categories'
		i = 0
		while i < @length
			category = @models[i].toJSON()

			j = 0
			while j < category.children.length
				childCat = category.children[j]

				# Find the category in the counters array
				categoryCount = _.where(counters, _id: childCat._id)[0]

				# Append the counters properly if needed
				if categoryCount
					category.count += categoryCount.total
					category.children[j].count = categoryCount.total
				j++
			@models[i].set category
			i++


	# Finds a category, given it's id
	find: (id) ->
		categories = @toJSON()
		i = 0
		while i < categories.length
			category = categories[i]
			j = 0
			while j < category.children.length
				child = category.children[j]
				if child._id is id
					return {
						child: child.name
						parent: category.name
					}
				j++
			i++