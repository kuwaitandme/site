module.exports = {
	/**
	 * Finds a category, given it's id.
	 */
	find: function (id) {
		var categories = window.categories;

		for(var i=0; i<categories.length; i++) {
			var category = categories[i];

			if(category.id == id) return category;
		}
	},

	/**
	 * Rearranges the category array into a parent-child type dictionary
	 */
	rearrange: function(categories) {
		var result = [];

		for(var i=0; i<categories.length; i++) {
			var parentCat = categories[i];

			if(!parentCat.parent) {
				parentCat.children = [];

				for(var j=0; j<categories.length; j++) {
					var childCat = categories[j];

					if(childCat.parent == parentCat.id)
						parentCat.children.push(childCat);
				}
				result.push(parentCat);
			}
		}
		return result;
	}
};