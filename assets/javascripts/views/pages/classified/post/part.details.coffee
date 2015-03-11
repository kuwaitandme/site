xss = require('xss')

module.exports = Backbone.View.extend
	events:
		'change #cat-selector': 'catSelected'
		'change #locations': 'unlockMapAndAddress'
		'change #price-selector': 'priceSelected'


	initialize: (options) ->
		@model = options.model
		@$address1 = @$el.find('#address1')
		@$address2 = @$el.find('#address2')
		@$email = @$el.find('#email')
		@$locations = @$el.find('#locations')
		@$category = @$el.find('#cat-selector')
		@$phone = @$el.find('#phone')
		@$priceField = @$el.find('#price-field')
		@$priceSelector = @$el.find('#price-selector')
		@$type = @$el.find('#ctype')

		@categories = app.models.categories.toJSON()
		@locations = app.models.locations.toJSON()

		@on "close", @close

		# Initialize parts of the form
		@initCategories()
		@initLocations()


	render: ->


	validate: (e) ->
		ret = true
		$els = @$el.find('[required]')
		$els.removeClass 'error'
		$els.each (i) ->
			$el = $els.eq(i)
			if !$el.val()
				$el.addClass 'error'
				ret = false
			return
		if !ret
			@model.trigger 'post:error', 'Some of the fields are missing'
			return ret
		@setModel()
		ret


	# Handler function to change the price boxes
	priceSelected: (event) ->
		val = @$priceSelector.find(':selected').val()
		switch val
			when 'Free'
				@$priceField.val 0
				@$priceField.addClass 'hide'
			when 'Custom'
				@$priceField.val null
				@$priceField.removeClass 'hide'
			when 'Contact Owner'
				@$priceField.val -1
				@$priceField.addClass 'hide'


	# Generates the HTML code for a select option.
	generateOption: (id, name, disabled) ->
		if disabled
			return '<option data-id=\'-1\' value=\'-1\' disabled>' + name + '</option>'
		'<option data-id=\'' + id + '\' value=\'' + id + '\'>' + name + '</option>'


	# Handler function to change the subcategory select box based on the parent
	# select option.
	catSelected: (e) ->
		id = (@$category.find ':selected').data 'id'

	# Initializes the categories option
	initCategories: ->
		@$category.val 0

		for category in @categories
			html = @generateOption category._id, category.name
			@$category.append html


	# Initializes the locations
	initLocations: ->
		for location in @locations
			html = @generateOption location._id, location.name
			@$locations.append html


	# Gets all the form data from the page, into a local variable and returns
	# it.
	setModel: ->
		@model.set
			category: @$category.val()
			price: @$priceField.val()
			type: @$type.val()
			contact:
				address1: xss(@$address1.val())
				address2: xss(@$address2.val())
				email: xss(@$email.val())
				location: @$locations.val()
				phone: xss(@$phone.val())

	close: ->
		@remove()
		@unbind()
		@stopListening()