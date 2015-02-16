var classified = require('../../models/classified'),
	config = require('../../config'),
	file = require('../helpers/file'),
	reCaptcha = require('../helpers/reCaptcha').Recaptcha,
	render = require('../helpers/render');


module.exports = {
	/**
	 * Controller for the guest posting page. Creates a new classified and
	 * saves it to the database.
	 */
	get: function(request, response, next) {


		/* Generate the response */
		return next();
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {

	}
}