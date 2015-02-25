var classified = require('../../models/classified'),
	config = require('../../config'),
	_2checkout = require('../helpers/_2checkout'),
	render = require('../helpers/render');

var classifiedFinish = require('../classified/finish');

/**
 * Controller for the classified posting page. Creates a new classified and
 * saves it to the database.
 *
 * If the post is successfully validated, create the post and redirect to the
 * account page or else stay in the same page and display an error
 */
var controller = module.exports = {
	get: function(request, response, next) {
		var id = request.params.id;
		if(!/^[0-9A-Z]*$/i.test(id)) return next();

		classified.get(id, function(classified) {
			/* Display 404 page if classified is not found */
			if(!classified) return next();

			render(request, response, {
				bodyid: 'guest-finish',
				page: 'guest/finish',
				title: response.__('title.guest.finish'),
				scripts: ['_2checkout', 'qrcode'],

				data: {
					classified: classified,
					_2checkout: {
						sid: config._2checkout.sid,
						publicKey: config._2checkout.publicKey
					},
					sitekey: config.reCaptcha.site
				}
			});
		});
	},

	post: classifiedFinish.post
}