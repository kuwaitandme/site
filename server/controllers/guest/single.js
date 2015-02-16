var classified = require('../../models/classified'),
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
		return classified.getGuest(request.param("id"), request.query.auth,
			function(classified) {

				return render(request, response, {
					bodyid: 'classified-single',
					page: 'classified/single',
					title: classified.title,
					scripts: ['googleMaps'],

					data: { classified: classified }
				});
		});
	},

	post: function(request, response, next) {

	}
}