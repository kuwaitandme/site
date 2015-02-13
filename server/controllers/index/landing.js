var async = require("async"),
	classified = require('../../models/classified'),
	mysql = require('../helpers/mysql'),
	render = require('../helpers/render');

/* Description for the meta tag */
var description = "Sell things that you don't want. Buy things at bargain "
	+ "prices! Publishing free classifieds in Kuwait have never been so "
	+ "quick and easy.";


/**
 * Controller for the landing page. Displays the front-page with the top
 * classifieds and categories to choose from.
 */
module.exports = {
	get: function(request, response, next) {
		/* Connect to the database and submit the queries */
		var db = mysql.connect();
		var topClassifieds = [], categoryCount = [];

		/* Prepare the DB queries to be run parallely */
		parallelTasks = [
			/* Get the top classifieds */
			function(callback) {
				classified.getTopClassifieds(function (result) {
					topClassifieds = result;
					callback();
				});
			},

			/* Get the number of classifieds per category */
			function(callback) {
				classified.classifiedsPerCategory(function (result) {
					categoryCount = result;
					callback();
				});
			}
		];

		/* Function to be run once done */
		asyncFinish = function () {
			/* Generate the response */
			render(request, response, {
				bodyid: "landing",
				description: description,
				page: 'landing',
				title: response.__('title.landing'),

				data: {
					categoryCount: categoryCount,
					topClassifieds: topClassifieds
				}
			}, db);
		}

		/* Run the tasks in parallel */
		async.parallel(parallelTasks, asyncFinish);
	}
}