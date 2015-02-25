var classified = require('../../models/classified'),
	config = require('../../config'),
	file = require('../helpers/file'),
	reCaptcha = require('../helpers/reCaptcha'),
	render = require('../helpers/render');


var controller = module.exports = {
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
		response.setHeader('Content-Type', 'application/json');

		if (!request.isAuthenticated()) return response.end(
			JSON.stringify({ status: "unauthorized" }));

		function captachFail() {
			return response.end(JSON.stringify({ status: "captchafail" }));
		}

		function captachSuccess() {
			classified.createFromPOST(request, request.user, function(cl) {
				/* Write to the page the link to redirect. This gets picked
				 * up by our AJAX controller */
				if(cl) {
					/* Write to the page the link to redirect. This gets
					 * picked up by our AJAX controller */
					return response.end(JSON.stringify({
						status: "success",
						id: cl._id
					}));
				}

				return response.end(JSON.stringify({ status: "notsaved" }));
			});
		}

		reCaptcha.verify(request, captachSuccess, captachFail, false);
	}
}