var classified = require("../../models/classified"),
	render = require('../helpers/render');

/**
 * Controller for the classified search page. Searches for classifieds with
 * some search parameters passed on as GET variables.
 *
 * DESCRIBE EACH PARAMETER HERE
 */
module.exports = {
	get: function(request, response, next) {
		var parameters = { };

		if(request.query.category) parameters["category"] = request.query.cat;

		classified.search(parameters, function(classifieds) {
			/* Generate the response */
			render(request, response, {
				bodyid: 'classified-search',
				page: 'classified/search',
				title: response.__('title.classified.search'),

				data: { classifieds: classifieds }
			});
		});
	}
}