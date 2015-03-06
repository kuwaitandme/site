var classified = global.models.classified,
	config = global.config,
	file = require('../../helpers/file'),
	formidable = require('formidable'),
	reCaptcha = require('../../reCaptcha'),
	render = require('../../helpers/render');


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
		var that = this;
		response.contentType('application/json');

		function captachFail() {
			response.status(401);
			response.end();
		}

		function captachSuccess() {
			/* Initialize formidable */
			var form = new formidable.IncomingForm();
			form.keepExtensions = true;
			form.multiples = true;
			form.maxFieldsSize = 10 * 1024 * 1024; /* 10MB */

			/* Start parsing the form */
			form.parse(request, function(err, fields, files) {
				if(err) throw err;
				var data = JSON.parse(fields.data);
				var files = files["files[]"];

				file.upload(files, function(files) {
					data.images = files;
					classified.create(data, request.user, function(cl) {
						/* If a classified was saved, then return it to the client. The
						 * returned classified will contain the id parameter which
						 * wasn't there before. */
						if(cl) return response.end(JSON.stringify(cl));

						/* If no classified was returned, then nothing was saved. So
						 * send a 400 Bad Request to the client */
						response.status(400);
						response.end();
					});
				});
			});
		}
		reCaptcha.verify(request, captachSuccess, captachFail, false);
	},


	/**
	 * Controller to upload images for a new classified
	 */
	put: function(request, response, next) {
		response.contentType('application/json');

		/* Check the header to see if this is a file upload form or not */
		if(response.header('x-fileupload'))
			return controller.doUpload(request, response, next);

		/* Check the header to see if we are updating the files or not */
		if(response.header('x-fileupdate'))
			return next();
			// return controller.doUpload(request, response, next);

		next();
	}
}