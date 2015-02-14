var recaptchaAsync = require('recaptcha-async');

var classified = require('../../models/classified'),
	file = require('../helpers/file'),
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
			data: {
				sitekey: config.reCaptcha.site
			}
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		var recaptcha = new recaptchaAsync.reCaptcha();
		// var useCaptcha = (config.reCaptcha ? true : false);
		var useCaptcha  = false;

		function captachFail() {
			response.end('/classified/post/?status="captchafail');
		}

		function captachSuccess() {
			file.upload(request, function(POSTdata) {

				request.body = POSTdata;
				classified.createFromPOST(request, false, function(cl) {
					/* Save the images */
					cl.images = uploadedFiles;
					cl.save();

					/* Write to the page the link to redirect. This gets picked
					 * up by our AJAX controller */
					response.end("/classified/single/" + classified._id);
				});
			});
		}

		/* Set the captcha with it's callback function */
		recaptcha.on('data', function (response) {
			if(response.is_valid) captachFail();
			else captachSuccess();
		});
	}
}