var guest = require('../../models/guest'),
	mysql = require('../helpers/mysql'),
	render = require('../helpers/render');

/**
 * Controller for the classified posting page. Creates a new classified and
 * saves it to the database.
 *
 * If the post is successfully validated, create the post and redirect to the
 * account page or else stay in the same page and display an error
 */
module.exports = {
	get: function(request, response, next) {
		var hash =  request.param("hash");

		/* Generate the response */
		render(request, response, {
			bodyid: 'guest-finish',
			page: 'guest/finish',
			title: response.__('title.guest.finish'),

			data: { hash: hash }
		});
	}
}