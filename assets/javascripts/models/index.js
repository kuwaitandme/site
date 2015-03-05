module.exports = {
	/* Model parent classes to be referred here. This allows any other function
	 * to easily instantiate the required model by just referencing from this
	 * module */
	classified: require("./classified"),
	classifieds: require("./classifieds"),
	// user: require("./user"),

	initialize: function(config) {
		/* Initialize the category and location model and populate them with
		 * their values.
		 *
		 * Since these models never change, we instantiate them first and
		 * save their instance as properties of this module.
		 *
		 * Note that other models are not instantiated and only these ones are.
		 */
		// this.category = new require("./category")(config);
		// this.location = new require("./location")(config);
	}
}