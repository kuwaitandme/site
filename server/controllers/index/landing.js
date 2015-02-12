var	model = require('../../models/classifieds'),
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
module.exports = function(request, response, next) {
	/* Connect to the database and submit the queries */
	var db = mysql.connect();

	/* Get the top classifieds */
	model.getTopClassifieds(db, function (topClassifieds) {

		/* Generate the response */
		render(response, {
			bodyid: "landing",
			description: description,
			page: 'landing',
			title: response.__('title.landing'),

			data: { topClassifieds: topClassifieds }
		}, db);

		/* Finally, close the db connection */
		db.end();
	});
}