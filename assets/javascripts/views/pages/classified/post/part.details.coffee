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
		@$parCategory = @$el.find('#cat-selector')
		@$phone = @$el.find('#phone')
		@$priceField = @$el.find('#price-field')
		@$priceSelector = @$el.find('#price-selector')
		@$subCategory = @$el.find('#subcat-selector')
		@$type = @$el.find('#ctype')

		@categories = app.models.categories.toJSON()
		@locations = app.models.locations.toJSON()

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
		id = @$parCategory.find(':selected').data('id')
		@$subCategory.show()
		@$subCategory.removeAttr 'disabled'
		i = 0
		while i < @categories.length
			if @categories[i]._id == id
				children = @categories[i].children
				@$subCategory.html @generateOption(0, 'Choose a sub-category', true)
				j = 0
				while j < children.length
					html = @generateOption(children[j]._id, children[j].name)
					@$subCategory.append html
					j++
				return
			i++

	# Initializes the categories option
	initCategories: ->
		@$subCategory.hide()
		@$parCategory.val 0
		i = 0
		while i < @categories.length
			html = @generateOption(@categories[i]._id, @categories[i].name)
			@$parCategory.append html
			i++

	# Initializes the locations
	initLocations: ->
		i = 0
		while i < @locations.length
			html = @generateOption(@locations[i]._id, @locations[i].name)
			@$locations.append html
			i++

	# Gets all the form data from the page, into a local variable and returns
	# it.
	setModel: ->
		@model.set
			category: @$subCategory.val()
			price: @$priceField.val()
			type: @$type.val()
			contact:
				address1: xss(@$address1.val())
				address2: xss(@$address2.val())
				email: xss(@$email.val())
				location: @$locations.val()
				phone: xss(@$phone.val())