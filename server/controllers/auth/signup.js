var render = require('../helpers/render');

/**
 * Controller for the Signup page. Attempts to register the user in.
 *
 * If registration was successful, redirect to the classified posting page so
 * that the user can start posting his/her classified.
 */
module.exports = function(request, response, next) {

	/* Generate the response */
	render(response, {
		bodyid: 'auth-signup',
		page: 'auth/signup',
		title: response.__('title.auth.signup')
	});
}