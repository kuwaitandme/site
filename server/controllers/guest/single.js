var model = require('../../models/classifieds'),
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
		/* Connect to the database to submit the queries */
		var db = mysql.connect();

		/* Get the classified */
		model.get(db,  request.param("id"), function(classified) {

			/* Generate the response */
			render(request, response, {
				bodyid: 'classified-single',
				description: null,
				page: 'classified/single',
				title: classified.title,

				data: { classified: classified }
			}, db);
		});
	}
}