var classifiedPost = require("./classified.post");

module.exports = classifiedPost.extend({
	/**
	 * Sets the category boxes to the given category
	 */
	setCategory: function(id) {
		/* First, find the category's properties */
		var category = app.helpers.category.find(id);

		/* Set the parent category */
		this.$parCategory.val(category.parent);

		/* Fill the child category, by invoking the event click function */
		this.catSelected();

		/* Set the child category */
		this.$subCategory.val(category.id);
	}
});