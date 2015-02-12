var render = require('../helpers/render');

/**
 * Controller for the classified search page. Searches for classifieds with
 * some search parameters passed on as GET variables.
 *
 * DESCRIBE EACH PARAMETER HERE
 */
module.exports = function(request, response, next) {

	/* Generate the response */
	render(response, {
		bodyid: 'classified-search',
		description: null,
		page: 'classified/search',
		title: response.__('title.classified.search')
	});
}