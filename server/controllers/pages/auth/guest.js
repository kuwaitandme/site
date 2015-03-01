var render = require('../../helpers/render');

/**
 * Controller for the guest page. Prompts to create a guest user, if so then
 * create one and redirect to the guest posting page.
 */
var controller = module.exports = {
	get: function(request, response, next) {
		/* Generate the response */
		return render(request, response, {
			bodyid: 'auth-guest',
			page: 'auth/guest',
			title: response.__('title.auth.guest')
		});
	}
}