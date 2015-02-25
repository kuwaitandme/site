var classified = require("../../models/classified"),
	render = require('../helpers/render');

/**
 * [getQueryParameters description]
 *
 * @param  Object  request [description]
 * @return Object          [description]
 */
var getQueryParameters = function(request) {
	var parameters = { };

	parameters.status = 1;

	if(request.query.cat && /^[0-9A-F]*$/i.test(request.query.cat))
		parameters.category = request.query.cat;

	if(request.query.keywords) {
		var keywords = request.query.keywords.split(' ');
		var regex = [];

		for(var i=0; i<keywords.length; i++)
			if(/^[0-9A-Z]*$/i.test(keywords[i]))
				regex.push(new RegExp(keywords[i], "i"));

		parameters.$or = [
			{ title:  { $in: regex } },
			{ description:  { $in: regex } },
		];
	}

	return parameters;
}

/**
 * Controller for the classified search page. Searches for classifieds with
 * some search parameters passed on as GET variables.
 */
module.exports = {

	/**
	 * [get description]
	 *
	 * DESCRIBE EACH PARAMETER HERE
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	get: function(request, response, next) {
		var parameters = getQueryParameters(request);

		classified.search(parameters, function(classifieds) {
			/* Generate the response */
			render(request, response, {
				bodyid: 'classified-search',
				page: 'classified/search',
				title: response.__('title.classified.search'),
				scripts: ['masonry', 'imagesLoaded'],

				data: { classifieds: classifieds }
			});
		}, 1);
	},


	/**
	 * [post description]
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	post: function(request, response, next) {
		var parameters = getQueryParameters(request);

		var page = 1;
		if(request.query.page) page = request.query.page;

		classified.search(parameters, function(classifieds) {
			response.end(JSON.stringify({ classifieds: classifieds }));
		}, page);
	}
}