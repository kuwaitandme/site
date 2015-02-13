var guest = require('../../models/guest'),
	render = require('../helpers/render');

module.exports = {

	/**
	 * Controller for the classified posting page. Creates a new classified and
	 * saves it to the database.
	 *
	 * If the post is successfully validated, create the post and redirect to the
	 * account page or else stay in the same page and display an error
	 */
	get: function(request, response, next) {
		/* Generate the response */
		render(request, response, {
			bodyid: 'guest-post',
			description: null,
			page: 'guest/post',
			title: response.__('title.guest.post')
		});
	},

	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		guest.createWithClassified("SDf", function(authHash) {
			response.redirect('/guest/finish/' + authHash);
		});
	}
}