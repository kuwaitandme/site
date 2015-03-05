// var idleController = require('./idleController');
var localStorage = require('./localStorage');
var router = require('./router');
// var webSocket = require('./webSocket');


module.exports = {
	/**
	 * Initializes each of the controllers one by one.
	 *
	 * @param  Object   config   The config object containing settings for each
	 *                           of the controller.
	 */
	initialize: function(config) {
		console.group("initialize controllers");

		// this.idleController = new idleController();
		this.localStorage = new localStorage();
		this.router = new router();
		// this.webSocket = new webSocket();

		// this.idleController.initialize(config.idleController);
		this.localStorage.initialize(config.localStorage);
		// this.webSocket.initialize(config.webSocket);
		this.router.initialize(config.router);

		console.groupEnd()
	}
}