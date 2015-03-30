module.exports = Backbone.View.extend
	name: '[view:classified-post:details]'
	events:
		'change #cat-selector'   : 'categoryChange'
		'change #locations'      : 'locationChange'
		'change #price-selector' : 'priceChange'


	initialize: (options) ->
		if options.model     then     @model = options.model
		if options.$el       then       @$el = options.$el
		if options.resources then @resources = options.resources


		@$address1        = @$ '#address1'
		@$address2        = @$ '#address2'
		@$category        = @$ '#cat-selector'
		@$email           = @$ '#email'
		@$locations       = @$ '#locations'
		@$phone           = @$ '#phone'
		@$priceField      = @$ '#price-field'
		@$priceRow        = @$ '#price-row'
		@$priceSelector   = @$ '#price-selector'
		@$type            = @$ '#ctype'

		@categories = @resources.categories.toJSON()
		@locations  = @resources.locations.toJSON()

		@on "close", @close

		@initCategories()
		@initLocations()
		window.a = @
		@setDOM()


	locationChange: (event) ->
		if @$locations.val()? and @$locations.val() != ""
			@$address1.removeClass "hide"
			@$address2.removeClass "hide"

			# ($ "#page-4-prev, #page-4-next").attr 'href', '#page-maps'
		else
			@$address1.addClass "hide"
			@$address2.addClass "hide"

			# ($ "#page-4-prev").attr 'href', '#page-images'
			# ($ "#page-4-next").attr 'href', '#page-submit'


	validate: (e) ->
		ret = true
		$els = @$ '[required]'

		$els.parent().removeClass 'show-error'
		for el in $els
			$el = $ el
			if not $el.val()
				$el.parent().addClass 'show-error'
				ret = false

		if not @$priceSelector.val()
			@$priceSelector.parent().addClass 'show-error'
			ret = false

		if not @$priceField.val()
			@$priceField.parent().parent().addClass 'show-error'
			ret = false

		if ret then @setModel()
		ret


	# Handler function to change the price boxes
	priceChange: (event) ->
		val = (@$priceSelector.find ':selected').val()
		switch Number val
			when 0 # Free
				@$priceField.val 0
				@$priceRow.addClass 'hide'
			when 1 # Specify value
				@$priceField.val null
				@$priceRow.removeClass 'hide'
			when -1 # Contact Owner
				@$priceField.val -1
				@$priceRow.addClass 'hide'


	setPrice: (value) ->
		if not value? then @$priceSelector.val ''
		else if value is 0 then @$priceSelector.val 0
		else if value is -1 then @$priceSelector.val -1
		else @$priceSelector.val 1


	# Generates the HTML code for a select option.
	generateOption: (id, name) -> "<option value='#{id}'>#{name}</option>"


	# Initializes the categories option
	initCategories: ->
		for category in @categories
			html = @generateOption category._id, category.name
			@$category.append html
		@$category.val 0


	# Initializes the locations
	initLocations: ->
		for location in @locations
			html = @generateOption location._id, location.name
			@$locations.append html


	setModel: ->
		location = @$locations.val()
		if location is "" then location = null

		@model.set
			category:     @$category.val()
			price:        @$priceField.val()
			type:         @$type.val()
			location:     location

		# Set the contact fields
		contact = { }
		checkandset = ($el, field) ->
			value = $el.val()
			if value then contact[field] = value

		checkandset @$phone, 'phone'
		checkandset @$address1, 'address1'
		checkandset @$address2, 'address2'
		checkandset @$email, 'email'

		@model.set contact: contact


	setDOM: ->
		contact = @model.get 'contact'

		@$address1.val    contact.address1
		@$address2.val    contact.address2
		@$category.val   (@model.get 'category') or ""
		@$email.val       contact.email
		@$locations.val  (@model.get 'location') or ""
		@$phone.val       contact.phone
		console.log @model.toJSON()
		console.log @model.get 'type'
		console.log @$type.val()
		@$type.val       @model.get 'type'
		console.log @$type.val()
		@setPrice         @model.get 'price'

		@locationChange()


	close: ->
		@remove()
		@unbind()
		@stopListening()