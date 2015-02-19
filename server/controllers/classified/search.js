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

		if(request.query.cat) parameters["category"] = request.query.cat;

		classified.search(parameters, function(classifieds) {
			/* Generate the response */
			render(request, response, {
				bodyid: 'classified-search',
				page: 'classified/search',
				title: response.__('title.classified.search'),
				scripts: ['masonry', 'imagesLoaded'],

				data: { classifieds: classifieds }
			});
		});
	},

	post: function(request, response, next) {
		var parameters = { };
		var page = 0;

		if(request.query.cat) parameters["category"] = request.query.cat;
		if(request.query.page) page = request.query.page;

		console.log(parameters);

		classified.search(parameters, function(classifieds) {
			response.end(JSON.stringify({ classifieds: classifieds }));
		}, page);
	}
}