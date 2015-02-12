var render = require('../helpers/render');

/**
 * Controller for the classified posting page. Creates a new classified and
 * saves it to the database.
 *
 * If the post is successfully validated, create the post and redirect to the
 * account page or else stay in the same page and display an error
 */
module.exports = function(request, response, next) {

	/* Generate the response */
	render(response, {
		bodyid: 'classified-post',
		description: null,
		page: 'classified/post',
		title: response.__('title.classified.post')
	});
}