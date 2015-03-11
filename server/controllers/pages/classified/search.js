var classified = global.models.classified,
	render = require('../../helpers/render');

/**
 * Controller for the classified search page. Searches for classifieds with
 * some search parameters passed on as GET variables.
 */
var controller = module.exports = {

	/**
	 * [get description]
	 *
	 * DESCRIBE EACH PARAMETER HERE
	 */
	get: function(request, response, next) {
		var parameters = controller.getQueryParameters(request);

		classified.search(parameters, function(classifieds) {
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
	 */
	post: function(request, response, next) {
		response.contentType('application/json');

		var parameters = controller.getQueryParameters(request);

		var page = 1;
		if(request.query.page) page = request.query.page;


		classified.search(parameters, function(classifieds) {
			response.end(JSON.stringify(classifieds));
		}, page);
	},


	/**
	 * [getQueryParameters description]
	 *
	 * @param  Object  request [description]
	 * @return Object          [description]
	 */
	getQueryParameters: function(request) {
		var parameters = { };

		parameters.status = 1;

		/* Set the category */
		if(request.query.category && /^[0-9A-F]*$/i.test(request.query.category))
			parameters.category = request.query.category;

		/* Set price min and max */
		var price = {}, priceMin, priceMax;
		priceMax = request.query.priceMax;
		priceMin = request.query.priceMin;
		if(priceMin && /^[-0-9]*$/.test(priceMin)) price.$gte = Number(priceMin);
		if(priceMax && /^[-0-9]*$/.test(priceMax)) price.$lte = Number(priceMax);
		if(Object.keys(price).length > 0) parameters.price = price;

		/* Set the classified type */
		var type = Number(request.query.type);
		if(type && (type == 1 || type == 0)) parameters.type = type;

		if(request.query.keywords) {
			var keywords = request.query.keywords.split(' ');
			var regex = [];

			for(var i=0; i<keywords.length; i++)
				if(/^[0-9A-Z]*$/i.test(keywords[i]))
					regex.push(new RegExp(keywords[i], "i"));

			parameters.$and = [{
				$or: [
					{ title:  { $all: regex } },
					{ description:  { $all: regex } },
				]
			}];
		}

		return parameters;
	}
}