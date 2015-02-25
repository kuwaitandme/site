var classified = require('../../models/classified'),
	file = require('../helpers/file'),
	config = require('../../config'),
	reCaptcha = require('../helpers/reCaptcha'),
	render = require('../helpers/render');


var controller =  module.exports = {
	/**
	 * Controller for the guest posting page. Creates a new classified and
	 * saves it to the database.
	 */
	get: function(request, response, next) {
		/* Generate the response */
		render(request, response, {
			bodyid: 'guest-post',
			description: null,
			page: 'classified/post',
			title: response.__('title.guest.post'),
			scripts: ['googleMaps', 'dropzone', 'reCaptcha'],

			data: {
				guest: true,
				sitekey: config.reCaptcha.site
			}
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		response.setHeader('Content-Type', 'application/json');

		function captachFail() {
			return response.end(JSON.stringify({ status: "captchafail" }));
		}

		function captachSuccess() {
			classified.createFromPOST(request, null, function(cl) {
				/* Write to the page the link to redirect. This gets picked
				 * up by our AJAX controller */
				if(cl) {
					/* Write to the page the link to redirect. This gets
					 * picked up by our AJAX controller */
					return response.end(JSON.stringify({
						status: "success",
						id: cl._id,
						authHash: cl.authHash
					}));
				}

				response.end(JSON.stringify({ status: "notsaved" }));
			});
		}

		/* Execute the Captcha first */
		captachSuccess();
		// reCaptcha.verify(request, captachSuccess, captachFail, false);
	}
}