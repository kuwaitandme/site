var classified = require('../../models/classified'),
	config = require('../../config'),
	_2checkout = require('../helpers/_2checkout'),
	render = require('../helpers/render');


module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		classified.get(request.param("id"), function(classified) {
			render(request, response, {
				bodyid: 'classified-finish',
				description: null,
				page: 'classified/finish',
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


	/**
	 * [post description]
	 */
	post: function(request, response, next) {
		_2checkout.processTransaction(request.body, function(err, data) {
			if(!data.exception) {
				var _id = request.body._id;

				/* Success! Add perks to the classified */
				if(request.body.perks[0]) classified.makeUrgent(_id);
				if(request.body.perks[1]) classified.promote(_id);

				response.end(JSON.stringify({ status: "success" }));
			} else {
				response.end(JSON.stringify(data.exception));
			}
		});
	}
}