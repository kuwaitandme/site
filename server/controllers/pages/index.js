var async = require("async"),
	classified = global.models.classified,
	render = require('../helpers/render');

var	redis = require('redis'),
	client = redis.createClient(null, null, { detect_buffers: true });

/* Description for the meta tag */
var description = "Sell things that you don't want. Buy things at bargain "
	+ "prices! Publishing free classifieds in Kuwait have never been so "
	+ "quick and easy.";

var	category = global.models.category,
	config = global.config;


/**
 * Controller for the landing page. Displays the front-page with the top
 * classifieds and categories to choose from.
 */
var controller = module.exports = {
	get: function(request, response, next) {

		/* Check the redis DB to see if our queries are cached or not */
		client.get("categories", function (err, result) {
			if (result) return finish(JSON.parse(result));

			/* If we reach here, then the query was not cached. Execute the
			 * query and cache it for next time */
			category.getAll(function(result) {
				var json = JSON.stringify(result);
				client.set("categories", json);

				finish(JSON.parse(result));
			});
		});

		finish = function (categories) {
			/* Generate the response */
			render(request, response, {
				bodyid: "landing",
				description: description,
				page: 'landing',
				scripts: ['masonry', 'imagesLoaded'],
				title: response.__('title.landing'),

				data: {
					categories: categories
				}
			});
		}
	},

	api: require('./api'),
	account: require('./account'),
	auth: require('./auth'),
	classified: require('./classified'),
	guest: require('./guest'),
	privacy: require('./privacy'),
	terms: require('./terms')
}