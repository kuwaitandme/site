var classified = require('../../models/classified'),
	config = require('../../config'),
	_2checkout = require('../helpers/_2checkout'),
	render = require('../helpers/render');


module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		classified.get(request.param('id'), function(classified) {
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
		var POSTdata = request.body;
		var perks = request.body["perks[]"];
		var price = 0;

		if(perks[0]) price += 5;
		if(perks[1]) price += 15;

		POSTdata = {
			sellerId: config._2checkout.sid,
			privateKey: config._2checkout.privateKey,
			merchantOrderId: (Math.random() * 100).toString(),
			token: request.body.token,
			perks: request.body["perks[]"],
			currency: 'USD',
			total: price,

			billingAddr: {
				name: "Testing Tester",
				addrLine1: "123 Test St",
				city: "Columbus",
				state: "Ohio",
				zipCode: "43123",
				country: "USA",
				email: "example@2co.com",
				phoneNumber: "5555555555"
			}
		};
		_2checkout.processTransaction(POSTdata, function(err, data) {
			if(err) return response.end(JSON.stringify(err));

			var _id = request.body._id;

			if(perks) {
				/* Success! Add perks to the classified */
				if(perks[0]) classified.makeUrgent(_id);
				// if(perks[1]) classified.promote(_id);
			}

			response.end(JSON.stringify({ status: 'success' }));
		});
	}
}