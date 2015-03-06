var categories = require("./categories");
var locations = require("./locations");

module.exports = {
	/* Model parent classes to be referred here. This allows any other function
	 * to easily instantiate the required model by just referencing from this
	 * module */
	classified: require("./classified"),
	classifieds: require("./classifieds"),
	// user: require("./user"),

	initialize: function(config) {
		console.group("[model] initializing");

		/* Initialize the category and location model and populate them with
		 * their values.
		 *
		 * Since these models never change, we instantiate them first and
		 * save their instance as properties of this module.
		 *
		 * Note that other models are not instantiated and only these ones are.
		 */
		this.categories = new categories(config);
		this.locations = new locations(config);

		console.groupEnd();
	}
}