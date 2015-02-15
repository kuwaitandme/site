module.exports = {
	/**
	 * Finds a category, given it's id.
	 */
	find: function (id) {
		var categories = window.categories;

		for(var i=0; i<categories.length; i++) {
			var category = categories[i];

			for(var j=0; j<category.children.length; j++) {
				var child = category.children[j];

				if(child._id == id) return {
					child: child.name,
					parent: category.name
				};
			}
		}
	},


	/**
	 * Appends the counters into each of the category respectively.
	 *
	 * @param  {[type]} categories [description]
	 * @param  {[type]} counters   [description]
	 * @return {[type]}            [description]
	 */
	appendCounters: function(categories, counters) {
		for(var i=0; i<categories.length; i++) {
			var parentCat = categories[i];
			var counter = 0;

			for(var j=0; j<parentCat.children.length; j++) {
				var childCat = parentCat.children[j];

				var categoryCount = _.where(window.data.categoryCount,
					{_id: childCat._id})[0];

				if(categoryCount) {
					counter += categoryCount.total;
					parentCat.children[j].count = categoryCount.total;
				} else {
					parentCat.children[j].count = "";
				}
			}
			categories[i].count = counter;
		}
		return categories;
	}
};