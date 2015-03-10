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
		'click .select-spawn .trigger' : 'spawnSelect'
		'change select': 'selectChanged'
		'change #select-category': 'categorySelected'
		'change #select-childcategory' : 'childCategorySelected'
		'submit #filter-box' : 'submitHandle'
		# 'change #price-selector': 'priceSelected'
		# 'click #filter-box-submit': 'submit'
		# 'click .keyword': 'keywordRemove'
		# 'click .option': 'toggleOption'


	initialize: (options) ->
		console.log @consoleSlug, 'initializing'
		if options and options.$el then @$el = options.$el

		# Setup DOM elements
		@$keywords = @$ "#filter-keywords"
		@$parentCategory = @$ "#select-category"
		@$childCategory = @$ "#select-childcategory"



	render: ->
		console.log @consoleSlug, 'rendering'

		@initializeCategory()

		that = @
		@$el.on 'submit', (event) ->
			that.submitHandle(event)

		# Start populating with contents from the URL
		@populateBox
			category: urlHelpers.getParam('cat')
			keywords: urlHelpers.getParam('keywords')
			location: urlHelpers.getParam('location')
			priceMax: urlHelpers.getParam('maxprice')
			priceMin: urlHelpers.getParam('minprice')
			type: urlHelpers.getParam('type')



	# Returns true iff the query is empty. A query is considered empty if there
	# are no keywords or if the category is not selected
	isQueryEmpty: ->
		@getQuery()
		not (@query.keywords or @query.category)


	# Gets a query object that can be passed to the backened
	getQuery: ->
		query = @query or {}

		# Get the keywords
		keywords = @$keywords.val()
		query.keywords = if keywords.length > 0 then keywords else null

		query


	# Opens up the select box for the given parent
	spawnSelect: (event) ->
		$el = $(event.currentTarget)
		$select = $el.parent().find 'select'
		@openSelect $select


	# Opens the select box given the selector
	openSelect: (selector) ->
		console.debug @consoleSlug, 'opening', selector
		element = $(selector)[0]
		worked = false

		# all browsers
		if document.createEvent
			e = document.createEvent('MouseEvents')
			e.initMouseEvent 'mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
			worked = element.dispatchEvent(e)
		# IE
		else if element.fireEvent then worked = element.fireEvent('onmousedown')
		# Unknown
		if !worked then console.error @consoleSlug 'opening select didn\'t work'


	# Handler function to get the value of the select box and display the value
	# onto the text placeholder while at the same time setting the query
	selectChanged: (event) ->
		$el = $ event.currentTarget
		field = $el.data 'field'
		value = $el.val()

		switch(field)
			when "type"
				switch(value)
					when "All"
						@query.type = null
					when "Offering"
						@query.type = 0
					when "Wanted"
						@query.type = 1
			when "price"
				switch(value)
					when "Free"
						@query.priceMin = @query.priceMax = 0
					when "Contact Owner"
						@query.priceMin = @query.priceMax = -1
					when "All"
						@query.priceMin = @query.priceMax = null

		# Signal any listeners that the query has changed
		@trigger 'changed', @getQuery()

		$target = $el.parent().find ".val"
		$target.text value


	# Populates the box with the given data
	populateBox: (@query) ->
		console.debug @consoleSlug, "fetching query from URL", @query

		@$keywords.val @query.keywords

	# Event handler that sets the contents of the child-category based on what
	# parent category was selected
	categorySelected: (event) ->
		html = ""

		# Find the parent category
		id = @$parentCategory.find(':selected').data 'id'
		category = categoriesModel.find id

		# Populate the child category, with the children of the parent category
		for childCategory in category.children
			html += @generateOption childCategory.name, childCategory.name,  childCategory._id

		@$childCategory.html html


	# Any change to the child
	childCategorySelected: (event) ->
		# Signal any listeners that the query has changed
		@trigger 'changed', @getQuery()


	# Prevent the form from submitting, but instead pass all the query variables
	# to any listeners
	submitHandle: (event) ->
		event.preventDefault()
		@trigger 'changed', @getQuery()


	# Initializes the parent category options
	initializeCategory: ->
		categories = categoriesModel.toJSON()
		html = ""

		for category in categories
			html += @generateOption(category.name, category.name, category._id)

		@$parentCategory.html html


	priceSelected: (e) ->
		val = $('#price-selector :selected').val()
		switch val
			when 'Free'
				@setPriceRange 0, 0
				@hidePriceRange()
			when 'Range'
				@setPriceRange null, null
				@showPriceRange()
			when 'Exact'
				@setPriceRange 1, 1
				@showPriceRangeExact()
			when 'Contact Owner'
				@setPriceRange -1, -1
				@hidePriceRange()


	hidePriceRange: ->
		@$el.find('input[name="maxprice"]').addClass 'hide'
		@$el.find('input[name="minprice"]').addClass 'hide'
		@$el.find('input[name="exactprice"]').addClass 'hide'


	showPriceRange: ->
		@hidePriceRange()
		@$el.find('input[name="maxprice"]').removeClass 'hide'
		@$el.find('input[name="minprice"]').removeClass 'hide'


	showPriceRangeExact: ->
		@hidePriceRange()
		@$el.find('input[name="exactprice"]').removeClass 'hide'


	setPriceRange: (min, max) ->
		@$el.find('input[name="maxprice"]').val max
		@$el.find('input[name="minprice"]').val min
		@$el.find('input[name="exactprice"]').val max
		if min == 0 and max == 0
			$('#price-selector').val 'Free'
			@hidePriceRange()
		else if min == -1 and max == -1
			$('#price-selector').val 'Contact Owner'
			@hidePriceRange()
		else if max == min
			$('#price-selector').val 'Exact'
			@showPriceRangeExact()
		else if min or max
			$('#price-selector').val 'Range'
			@showPriceRange()
		return


	setSubCategory: (id) ->
		categories = window.data.categories
		i = 0
		while i < categories.length
			children = categories[i].children
			j = 0
			while j < children.length
				if children[j] and children[j].id == id

					### Set the parent category ###

					$('#cat-selector').val children[j].parent

					### Populate the child category ###

					@categorySelected()

					### Set the child category ###

					$('#subcat-selector').val children[j].id
					return
				j++
			i++
		return

	generateOption: (value, name, id) ->
		html = "<option value='#{ value }' data-id='#{ id }'>#{ name }</options>"
		return html

	keywordAdd: (text) ->
		if !text.length
			return
		$container = $('#filter-box-keywords .keyword-container')
		html = '<div class="keyword">' + text + '</div>'

		### Generate the DOM element, add it and animate it. ###

		$el = $(html).hide()
		$container.append $el
		$el.fadeIn()
		return
	keywordRemove: (e) ->
		console.log e
		$el = $(e.currentTarget)
		$el.fadeOut ->
			$el.remove()
			return
		return


	keywordHandleInput: (event) ->
		$el = $ event.currentTarget
		value = $el.val()

		if value.length > 0 then @query.keywords = value
		else @query.keywords = null

		# If spacebar/return is pressed then add a keyword bubble with the text
		# inside the bubble, if it's not empty.
		# if e.charCode == 32 or e.charCode == 13 and el.value.length
		# 	@keywordAdd el.value.trim()
		# 	el.value = ''
		# return

	keywordGetText: ->
		ret = ''

		### Iterate through each of the keywords and concatenate it's values
		# into 'ret'.
		###

		$keywords = $('#filter-box-keywords .keyword')
		$keywords.each (i) ->
			$el = $($keywords.get(i))
			ret += $el.text() + ' '
			return
		ret.trim()
	getPriceRange: ->
		max = @$el.find('input[name="maxprice"]').val()
		min = @$el.find('input[name="minprice"]').val()
		exact = @$el.find('input[name="exactprice"]').val()
		if $('#price-selector :selected').val() == 'Exact'
			return {
				max: exact
				min: exact
			}
		{
			max: max
			min: min
		}