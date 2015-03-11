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
			return @set JSON.parse(cache)

		if window.data.categories
			console.log '[model:categories] setting categories from page'
			console.log window.data.categories
			console.groupEnd()
			return @set window.data.categories

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
				console.groupEnd()

			error: (e) ->
				console.error '[model:categories] error fetching category details', e
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

		for category in categories
			if category._id is id then return category
			for childCategory in category.children
				if childCategory._id is id then return childCategory