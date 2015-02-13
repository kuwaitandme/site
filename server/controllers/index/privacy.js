var render = require('../helpers/render');

/**
 * Controller for the privacy page. Simply displays the privacy policy view.
 */
module.exports = function(request, response, next) {

	/* Generate the response */
	render(request, response, {
		bodyid: 'privacy',
		page: 'privacy',
		title: response.__('title.privacy'),
	});
}