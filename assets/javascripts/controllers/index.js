var localStorage = require('./localStorage');
var pageTransition = require("./pageTransition");
var router = require('./router');


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
		this.pageTransition = new pageTransition();
		this.router = new router();

		this.pageTransition.initialize(config.pageTransition);
		this.localStorage.initialize(config.localStorage);
		this.router.initialize(config.router);

		console.groupEnd()
	}
}