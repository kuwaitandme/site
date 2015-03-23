urlHelpers = (require 'app-helpers').url

module.exports = Backbone.View.extend
	consoleSlug: '[view:filterbox]'

	query:
		category: null
		keywords: null
		location: null
		priceMax: null
		priceMin: null
		type: null

	events:
		'change #select-type' : 'updateType'
		'change #select-price' : 'updatePrice'
		'change #select-category': 'updateCategory'
		'submit #filter-box' : 'submitHandle'
		'keypress #filter-keywords': 'updateKeywords'


	initialize: (options) ->
		console.log @consoleSlug, 'initializing'
		if options
			if options.$el then @$el = options.$el
			if options.query then @query = options.query

		# Setup DOM elements
		@$keywords       = @$ "#filter-keywords"
		@$category       = @$ "#select-category"
		@$selectPrice    = @$ "#select-price"
		@$selectType     = @$ "#select-type"

		@keywordsLock = 0

		# Start populating with contents from the URL
		urlQuery =
			category: urlHelpers.getParam 'category'
			keywords: urlHelpers.getParam 'keywords'
			location: urlHelpers.getParam 'location'
			priceMax: urlHelpers.getParam 'priceMax'
			priceMin: urlHelpers.getParam 'priceMin'
			type:     urlHelpers.getParam 'type'

		@populateBox urlQuery


	render: ->
		console.log @consoleSlug, 'rendering'
		that = @

		# Populate the category box
		@initializeCategory()

		# Set the event handler
		handler = (event) -> that.submitHandle(event)
		@$el.off 'submit', handler
		@$el.on  'submit', handler


	# Gets a query object that can be passed to the backened
	getQuery: ->
		query = @query or {}

		# Get the keywords
		keywords = @$keywords.val() or ""
		query.keywords = if keywords.length > 0 then keywords else null

		query


	# Populates the box with the given data
	populateBox: (@query) ->
		console.debug @consoleSlug, "setting query to filterbox", @query

		@$category.val   @query.category
		@$keywords.val   @query.keywords
		@$selectType.val @query.type


	# Prevent the form from submitting, but instead pass all the query variables
	# to any listeners
	submitHandle: (event) ->
		event.preventDefault null
		@trigger 'changed'


	# Initializes the parent category options
	initializeCategory: ->
		categoriesModel = app.models.categories
		categories = categoriesModel.toJSON null
		@$category.html ""

		# Add the 'all' option
		@$category.append (@generateOption '', 'All', false, true)

		# Add the rest of the parent categories
		for category in categories
			@$category.append (@generateOption category._id, category.name)


	# Generates the option box with the given values
	generateOption: (value, name, disabled=false, selected=false) ->
		attributes = "value='#{ value }'"
		# attributes = ''
		if disabled then attributes += ' disabled'
		if selected then attributes += ' selected'

		"<option #{ attributes }>#{ name }</option>"


	# Handler for when the price field changed.
	updatePrice: ->
		value = @$selectPrice.val()
		switch(value)
			when "Free" then @query.priceMin = @query.priceMax = 0
			when "Contact Owner" then @query.priceMin = @query.priceMax = -1
			when "All" then @query.priceMin = @query.priceMax = null

		@trigger 'changed'


	# Handler for when the classified type field changed.
	updateType: ->
		value = @$selectType.val()
		switch(value)
			when "All" then @query.type = null
			when "Offering" then @query.type = 0
			when "Wanted" then @query.type = 1

		@trigger 'changed'


	# Handler for when the classified list changed
	updateCategory: ->
		@query.category = @$category.val() or ''
		@trigger 'changed'


	# Handler for when the keywords change. This is a nice little function that
	# applies somewhat of a mutex functionality. The end result is that the
	# function will fire the 'changed' event for the last keypress that is
	# uninterrupted for a 1 second delay. 'uninterrupted' here means that
	# the user has not typed anything (this we assume is the min. time that the
	# user would to consider his/her query complete
	updateKeywords: ->
		that = @

		# Update the lock
		@keywordsLock += 1

		timeoutFunction = ->
			# if we greater than the lock's threshold then that means some other
			# keypress event was fired before us. So we must decrement the lock
			# and return so that when the last keypress event comes in this
			# function it will validate and go through
			if that.keywordsLock > 1 then return that.keywordsLock -= 1

			# Get the keywords and fire the event
			that.query.keywords = that.$keywords.val() or ''
			that.trigger 'changed'

			# Reset the lock for future events
			that.keywordsLock = 0

		# We set the timegap between events to be a 1000 ms
		setTimeout timeoutFunction, 1000