var async = require("async"),
	classified = global.models.classified,
	render = require('../helpers/render');

/* Description for the meta tag */
var description = "Sell things that you don't want. Buy things at bargain "
	+ "prices! Publishing free classifieds in Kuwait have never been so "
	+ "quick and easy.";


/**
 * Controller for the landing page. Displays the front-page with the top
 * classifieds and categories to choose from.
 */
var controller = module.exports = {
	get: function(request, response, next) {

		/* Get the number of classifieds per category */
		classified.classifiedsPerCategory(function (result) {
			var categoryCount = result;

			/* Generate the response */
			return render(request, response, {
				bodyid: "landing",
				description: description,
				page: 'landing',
				scripts: ['masonry', 'imagesLoaded'],
				title: response.__('title.landing'),

				data: { categoryCount: categoryCount }
			});
		});
	},

	account: require('./account'),
	auth: require('./auth'),
	classified: require('./classified'),
	guest: require('./guest'),
	privacy: require('./privacy'),
	terms: require('./terms')
}