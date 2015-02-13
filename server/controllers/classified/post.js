var render = require('../helpers/render');
module.exports = {

	/**
	 * Controller for the classified posting page. Creates a new classified and
	 * saves it to the database.
	 *
	 * If the post is successfully validated, create the post and redirect to the
	 * account page or else stay in the same page and display an error
	 */
	get: function(request, response, next) {
		if (!request.isAuthenticated()) response.redirect('/auth/guest');

		/* Generate the response */
		render(request, response, {
			bodyid: 'classified-post',
			description: null,
			page: 'classified/post',
			title: response.__('title.classified.post')
		});
	},

	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {

	}
}