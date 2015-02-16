var classified = require('../../models/classified'),
	config = require('../../config'),
	file = require('../helpers/file'),
	reCaptcha = require('../helpers/reCaptcha').Recaptcha,
	render = require('../helpers/render');


module.exports = {
	/**
	 * Controller for the classified posting page. Creates a new classified and
	 * saves it to the database.
	 *
	 * If the post is successfully validated, create the post and redirect to the
	 * account page or else stay in the same page and display an error
	 */
	get: function(request, response, next) {
		if (!request.isAuthenticated()) return response.redirect('/auth/guest');

		/* Generate the response */
		return render(request, response, {
			bodyid: 'classified-post',
			description: null,
			page: 'classified/post',
			title: response.__('title.classified.post'),
			scripts: ['googleMaps', 'dropzone', 'reCaptcha'],

			data: {
				sitekey: config.reCaptcha.site
			}
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		if (!request.isAuthenticated()) return response.redirect('/auth/guest');

		var useCaptcha = (config.reCaptcha ? true : false);

		function captachFail() {
			response.end('/classified/post/?status=captchafail');
		}

		function captachSuccess() {
			file.upload(request, function(POSTdata) {

				request.body = POSTdata;
				classified.createFromPOST(request, false, function(cl) {
					/* Write to the page the link to redirect. This gets picked
					 * up by our AJAX controller */
					response.end("/classified/single/" + classified._id);
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
				if(success) captachSuccess();
				else captachFail();
			});
		} else { captachSuccess(); }
	}
}