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

			/* Generate the response */
			render(request, response, {
				bodyid: 'guest-post',
				description: null,
				page: 'classified/post',
				title: response.__('title.guest.post'),
				scripts: ['googleMaps', 'dropzone', 'reCaptcha'],

				data: {
					braintreeToken: braintreeToken,
					guest: true,
					sitekey: config.reCaptcha.site
				}
			});
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		var useCaptcha = (config.reCaptcha ? true : false);
		console.log(request.body);
		function captachFail() {
			response.end('/guest/post/?status=captchafail');
		}

		function captachSuccess() {
			/* Upload the images */
			file.upload(request, function(POSTdata) {
				/* Perform any transactions */
				braintree.performTransaction(POSTdata, function() {
					/* Create the classified */
					request.body = POSTdata;
					classified.createFromPOST(POSTdata, true, function(cl) {
						/* Write to the page the link to redirect. This gets picked
						 * up by our AJAX controller */
						response.end('/guest/finish/' + cl._id + '?hash=' +
							cl.authHash);
					});
				})
			});
		}

		/* Check the captcha, which then calls the function to create the
		 * user */
		if(useCaptcha && false) {
			/* Create the reCapthca object */
			var recaptcha = new reCaptcha(
				config.reCaptcha.site,
				config.reCaptcha.secret, {
					'remoteip' : request.connection.remoteAddress,
					'response' : request.query.captcha
				});

			/* Send it to the google and create the user if successful */
			recaptcha.verify(function (err, success) {
				console.log(err, success);
				if(success) captachSuccess();
				else captachFail();
			});
		} else { captachSuccess(); }
	}
}