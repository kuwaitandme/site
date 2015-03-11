var classified = global.models.classified,
	render = require('../../helpers/render');


var controller = module.exports = {
	/**
	 * [get description]
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	get: function(request, response, next) {
		var parameters = controller.getQueryParameters(request);

		classified.search(parameters, function(classifieds) {
			render(request, response, {
				bodyid: 'account-manage',
				page: 'classified/search',
				scripts: ['masonry', 'imagesLoaded'],
				title: response.__('title.classified.search'),

				data: { classifieds: classifieds }
			});
		}, 1, true);
	},


	/**
	 * [post description]
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	post: function(request, response, next) {
		var parameters = controller.getQueryParameters(request);
		var page = 1;

		if(request.query.page) page = request.query.page;

		classified.search(parameters, function(classifieds) {
			response.end(JSON.stringify(classifieds));
		}, page, true);
	},


	/**
	 * [getQueryParameters description]
	 *
	 * @param  Object  request [description]
	 * @return Object          [description]
	 */
	getQueryParameters: function(request) {
		var parameters = { };

		if(request.user && request.user.isAdmin)
			parameters.status = classified.status.INACTIVE;//[classified.status.FLAGGED, classified.status.INACTIVE];
		else parameters.owner = request.user._id;

		return parameters;
	}
}