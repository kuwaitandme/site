module.exports = {
	/**
	 * Finds a category, given it's id.
	 */
	find: function (id) {
		var categories = window.categories;

		for(var i=0; i<categories.length; i++) {
			var category = categories[i];

			if(category.id == id) return category;

			for(var j=0; j<category.children.length; j++) {
				var subcategory = category.children[j];

				if(subcategory.id == id) return subcategory;
			}
		}
	}
};