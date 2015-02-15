var classified = require('../../models/classified'),
	config = require('../../config'),
	file = require('../helpers/file'),
	reCaptcha = require('../helpers/reCaptcha').Recaptcha,
	render = require('../helpers/render');


module.exports = {
	/**
	 * Controller for the guest posting page. Creates a new classified and
	 * saves it to the database.
	 */
	get: function(request, response, next) {
		/* Generate the response */
		return render(request, response, {
			bodyid: 'guest-post',
			description: null,
			page: 'classified/post',
			title: response.__('title.guest.post'),
			data: {
				sitekey: config.reCaptcha.site
			}
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		var useCaptcha = (config.reCaptcha ? true : false);

		function captachFail() {
			response.end('/guest/post/?status=captchafail');
		}

		function captachSuccess() {
			file.upload(request, function(POSTdata) {

				request.body = POSTdata;
				classified.createFromPOST(request, true, function(cl) {
					/* Write to the page the link to redirect. This gets picked
					 * up by our AJAX controller */
					response.end('/guest/finish/' + cl._id + '?hash=' +
						cl.authHash);
				});
			});
		}

		/* Check the captcha, which then calls the function to create the
		 * user */
		if(useCaptcha) {
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