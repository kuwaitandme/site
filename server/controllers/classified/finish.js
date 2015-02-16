
var classified = require('../../models/classified'),
	config = require('../../config'),
	braintree = require('../helpers/braintree'),
	file = require('../helpers/file'),
	reCaptcha = require('../helpers/reCaptcha').Recaptcha,
	render = require('../helpers/render');


module.exports = {
	/**
	 * Controller for the guest posting page. Creates a new classified and
	 * saves it to the database.
	 */
	get: function(request, response, next) {
		braintree.getClientToken(function(braintreeToken) {

			return render(request, response, {
				bodyid: 'classified-finish',
				description: null,
				page: 'classified/finish',
				title: response.__('title.guest.finish'),
				data: {
					braintreeToken: braintreeToken,
					sitekey: config.reCaptcha.site
				}
			});

		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {

		braintree.performTransaction(request, function() {

		})

	}
}