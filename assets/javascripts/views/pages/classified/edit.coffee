url    = (require 'app-helpers').url
view   = require './post'

module.exports = view.extend
	name: '[view:classifieds-edit]'

	getModel: ->
		id = (document.URL.split '/')[4]

		if not @model? then @model = new app.models.classified
			_id: id
		@model.fetch()
		# @model.id = id

		console.log id, @model

	setCategory: (id) ->
		# First, find the category's properties
		category = app.helpers.category.find(id)

		# Set the parent category
		@$parCategory.val category.parent

		# Fill the child category, by invoking the event click function
		@catSelected()

		# Set the child category
		@$subCategory.val category.id