var render = require('../../helpers/render');
var User = global.models.user;

/**
 * Controller for the guest page. Prompts to create a guest user, if so then
 * create one and redirect to the guest posting page.
 */
var controller = module.exports = {
	get: function(request, response, next) {
		var failUrl = '/auth/login?error=activate_fail';
		var successUrl = '/auth/login?success=activate_success';

		/* Get the parameters */
		var token = request.query.token;
		var id = request.params.id;

		/* Clean out the parameters */
		if(token.length != 24 || !/^[0-9A-F]*$/i.test(id)) return next();

		/* Try and activate the user */
		User.activate(id, token, function(err, success) {
			if(success) return response.redirect(successUrl);
			response.redirect(failUrl);
		});
	}
}