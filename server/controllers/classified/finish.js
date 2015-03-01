var classified = require('../../models/classified'),
	config = require('../../../var/config'),
	_2checkout = require('../helpers/_2checkout'),
	render = require('../helpers/render');


var controller = module.exports = {
	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		var id = request.params.id;
		if(!/^[0-9A-F]*$/i.test(id)) return next();

		classified.get(id, function(classified) {
			/* Display 404 page if classified is not found */
			if(!classified) return next();

			render(request, response, {
				bodyid: 'classified-finish',
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
		var id = request.params.id;
		var POSTdata = request.body;

		if(!request.body || request.body.length == 0) return next();
		if(!request.body.token) return next();
		if(!/^[0-9A-F]*$/i.test(id)) return next();

		var perks = request.body["perks[]"];
		var price = 0;
		perks[0] = true;
		perks[1] = false;

		if(perks[0]) price += 15;
		if(perks[1]) price += 45;

		POSTdata = {
			sellerId: config._2checkout.sid,
			privateKey: config._2checkout.privateKey,
			token: request.body.token,
			// perks: request.body["perks[]"],
			currency: 'USD',
			total: price,

			billingAddr: {
				addrLine1: request.body['billingAddr[addrLine1]'],
				addrLine2: request.body['billingAddr[addrLine2]'],
				city: request.body['billingAddr[city]'],
				country: request.body['billingAddr[country]'],
				email: request.body['billingAddr[email]'],
				name: request.body['billingAddr[name]'],
				phoneNumber: request.body['billingAddr[phoneNumber]'],
				state: request.body['billingAddr[state]'],
				zipCode: request.body['billingAddr[zipCode]']
			}
		};

		_2checkout.processTransaction(id, POSTdata, function(err, data, transaction) {
			if(err) return response.end(JSON.stringify({
				data: data,
				error: err,
				transaction: transaction,
			}));

			/* Success! Add perks to the classified */
			if(perks) {
				if(perks[0]) classified.makeUrgent(_id);
				// if(perks[1]) classified.promote(_id);
			}

			response.end(JSON.stringify({
				status: 'success',
				transaction: transaction
			}));
		});
	}
}