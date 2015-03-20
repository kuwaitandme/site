view = require './post'

module.exports = view.extend
	name: '[view:classifieds-edit]'

	setCategory: (id) ->
		# First, find the category's properties
		category = app.helpers.category.find(id)

		# Set the parent category
		@$parCategory.val category.parent

		# Fill the child category, by invoking the event click function
		@catSelected()

		# Set the child category
		@$subCategory.val category.id