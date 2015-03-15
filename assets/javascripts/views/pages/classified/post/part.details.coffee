xss = require 'xss'

module.exports = Backbone.View.extend
	name: '[view:classified-post:details]'
	events:
		'change #cat-selector'   : 'categoryChange'
		'change #locations'      : 'locationChange'
		'change #price-selector' : 'priceChange'


	initialize: (@options) ->
		if @options.model then @model = @options.model
		if @options.$el   then   @$el = @options.$el

		@$address1        = @$ '#address1'
		@$address2        = @$ '#address2'
		@$category        = @$ '#cat-selector'
		@$email           = @$ '#email'
		@$locations       = @$ '#locations'
		@$phone           = @$ '#phone'
		@$priceField      = @$ '#price-field'
		@$priceSelector   = @$ '#price-selector'
		@$type            = @$ '#ctype'

		@categories = app.models.categories.toJSON()
		@locations  = app.models.locations.toJSON()

		@on "close", @close

		@initCategories()
		@initLocations()

		@setDOM()


	locationChange: (event) ->
		lastVal = (@$locations.find 'option:last-child').val()

		if @$locations.val() != lastVal
			@$address1.removeClass "hide"
			@$address2.removeClass "hide"

			($ "#page-4-prev, #page-4-next").attr 'href', '#page-maps'
		else
			@$address1.addClass "hide"
			@$address2.addClass "hide"

			($ "#page-4-prev").attr 'href', '#page-images'
			($ "#page-4-next").attr 'href', '#page-submit'


	validate: (e) ->
		ret = true
		$els = @$ '[required]'

		$els.removeClass 'error'
		$els.each (i) ->
			$el = $els.eq i
			if not $el.val()
				$el.addClass 'error'
				ret = false
			return
		if not ret
			@model.trigger 'post:error', 'Some of the fields are missing'
			return ret
		@setModel()
		ret


	# Handler function to change the price boxes
	priceChange: (event) ->
		val = (@$priceSelector.find ':selected').val()
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
		@model.set
			category: @$category.val()
			price: @$priceField.val()
			type: @$type.val()
			contact:
				address1: xss @$address1.val()
				address2: xss @$address2.val()
				email: xss @$email.val()
				location: @$locations.val()
				phone: xss @$phone.val()


	setDOM: ->
		console.log @name, @model.get 'category'
		@$address1.val   (@model.get 'contact').address1
		@$address2.val   (@model.get 'contact').address2
		# @$category.val    @model.get 'category' or 0
		@$email.val      (@model.get 'contact').email
		@$locations.val  (@model.get 'contact').location
		@$phone.val      (@model.get 'contact').phone
		@$priceField.val  @model.get 'price'
		@$type.val        @model.get 'type'


	close: ->
		@remove()
		@unbind()
		@stopListening()