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

		if(request.query.cat) parameters.category = request.query.cat;
		if(request.query.keywords) {
			var keywords = request.query.keywords.split(' ');
			var regex = [];

			for(var i=0; i<keywords.length; i++)
				regex.push(new RegExp(keywords[i], "i"));

			parameters.$or = [
				{ title:  { $in: regex } },
				{ description:  { $in: regex } },
			];
			// parameters.description = parameters.title;
		}
		console.log(parameters);

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
		var page = 1;

		if(request.query.cat) parameters["category"] = request.query.cat;
		if(request.query.page) page = request.query.page;

		classified.search(parameters, function(classifieds) {
			response.end(JSON.stringify({ classifieds: classifieds }));
		}, page);
	}
}