urlHelpers = (require 'app-helpers').url
categoriesModel = (require 'app-models').categories

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


	render: ->
		console.log @consoleSlug, 'rendering'
		that = @

		# Populate the category box
		@initializeCategory()

		# Set the event handler
		handler = (event) -> that.submitHandle(event)
		@$el.off 'submit', handler
		@$el.on  'submit', handler

		# Start populating with contents from the URL
		@populateBox
			category: urlHelpers.getParam 'category'
			keywords: urlHelpers.getParam 'keywords'
			location: urlHelpers.getParam 'location'
			priceMax: urlHelpers.getParam 'priceMax'
			priceMin: urlHelpers.getParam 'priceMin'
			type:     urlHelpers.getParam 'type'


	# Gets a query object that can be passed to the backened
	getQuery: ->
		query = @query or {}

		# Get the keywords
		keywords = @$keywords.val()
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


	updateKeywords: ->
		that = @
		@keywordsLock += 1

		timeoutFunction = ->
			if that.keywordsLock > 1
				that.keywordsLock -= 1
				return

			that.query.keywords = that.$keywords.val() or ''
			that.trigger 'changed'
			that.keywordsLock = 0


		setTimeout timeoutFunction, 1000

	# priceSelected: (e) ->
	# 	val = $('#price-selector :selected').val()
	# 	switch val
	# 		when 'Free'
	# 			@setPriceRange 0, 0
	# 			@hidePriceRange()
	# 		when 'Range'
	# 			@setPriceRange null, null
	# 			@showPriceRange()
	# 		when 'Exact'
	# 			@setPriceRange 1, 1
	# 			@showPriceRangeExact()
	# 		when 'Contact Owner'
	# 			@setPriceRange -1, -1
	# 			@hidePriceRange()


	# hidePriceRange: ->
	# 	@$el.find('input[name="maxprice"]').addClass 'hide'
	# 	@$el.find('input[name="minprice"]').addClass 'hide'
	# 	@$el.find('input[name="exactprice"]').addClass 'hide'


	# showPriceRange: ->
	# 	@hidePriceRange()
	# 	@$el.find('input[name="maxprice"]').removeClass 'hide'
	# 	@$el.find('input[name="minprice"]').removeClass 'hide'


	# showPriceRangeExact: ->
	# 	@hidePriceRange()
	# 	@$el.find('input[name="exactprice"]').removeClass 'hide'


	# setPriceRange: (min, max) ->
	# 	@$el.find('input[name="maxprice"]').val max
	# 	@$el.find('input[name="minprice"]').val min
	# 	@$el.find('input[name="exactprice"]').val max
	# 	if min == 0 and max == 0
	# 		$('#price-selector').val 'Free'
	# 		@hidePriceRange()
	# 	else if min == -1 and max == -1
	# 		$('#price-selector').val 'Contact Owner'
	# 		@hidePriceRange()
	# 	else if max == min
	# 		$('#price-selector').val 'Exact'
	# 		@showPriceRangeExact()
	# 	else if min or max
	# 		$('#price-selector').val 'Range'
	# 		@showPriceRange()
	# 	return


	# setSubCategory: (id) ->
	# 	categories = window.data.categories
	# 	i = 0
	# 	while i < categories.length
	# 		children = categories[i].children
	# 		j = 0
	# 		while j < children.length
	# 			if children[j] and children[j].id == id

	# 				### Set the parent category ###

	# 				$('#cat-selector').val children[j].parent

	# 				### Populate the child category ###

	# 				@categorySelected()

	# 				### Set the child category ###

	# 				$('#subcat-selector').val children[j].id
	# 				return
	# 			j++
	# 		i++
	# 	return



	# keywordAdd: (text) ->
	# 	if !text.length
	# 		return
	# 	$container = $('#filter-box-keywords .keyword-container')
	# 	html = '<div class="keyword">' + text + '</div>'

	# 	### Generate the DOM element, add it and animate it. ###

	# 	$el = $(html).hide()
	# 	$container.append $el
	# 	$el.fadeIn()
	# 	return
	# keywordRemove: (e) ->
	# 	console.log e
	# 	$el = $(e.currentTarget)
	# 	$el.fadeOut ->
	# 		$el.remove()
	# 		return
	# 	return


	# keywordHandleInput: (event) ->
	# 	$el = $ event.currentTarget
	# 	value = $el.val()

	# 	if value.length > 0 then @query.keywords = value
	# 	else @query.keywords = null

	# 	# If spacebar/return is pressed then add a keyword bubble with the text
	# 	# inside the bubble, if it's not empty.
	# 	# if e.charCode == 32 or e.charCode == 13 and el.value.length
	# 	# 	@keywordAdd el.value.trim()
	# 	# 	el.value = ''
	# 	# return

	# keywordGetText: ->
	# 	ret = ''

	# 	### Iterate through each of the keywords and concatenate it's values
	# 	# into 'ret'.
	# 	###

	# 	$keywords = $('#filter-box-keywords .keyword')
	# 	$keywords.each (i) ->
	# 		$el = $($keywords.get(i))
	# 		ret += $el.text() + ' '
	# 		return
	# 	ret.trim()
	# getPriceRange: ->
	# 	max = @$el.find('input[name="maxprice"]').val()
	# 	min = @$el.find('input[name="minprice"]').val()
	# 	exact = @$el.find('input[name="exactprice"]').val()
	# 	if $('#price-selector :selected').val() == 'Exact'
	# 		return {
	# 			max: exact
	# 			min: exact
	# 		}
	# 	{
	# 		max: max
	# 		min: min
	# 	}