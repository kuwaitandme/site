var localStorage = require("./localStorage");
var pageTransition = require("./pageTransition");
var router = require("./router");
var resourceLoader = require("./resourceLoader");


module.exports = {
	/**
	 * Initializes each of the controllers one by one.
	 *
	 * @param  Object   config   The config object containing settings for each
	 *                           of the controller.
	 */
	initialize: function(config) {
		console.group("[controller] initializing");

		this.localStorage = new localStorage();
		this.router = new router();
		this.pageTransition = new pageTransition();
		this.resourceLoader = new resourceLoader();

		this.localStorage.initialize(config.localStorage);
		this.router.initialize(config.router);
		this.pageTransition.initialize(config.pageTransition);
		this.resourceLoader.initialize(config.resourceLoader);

		console.groupEnd()
	}
}