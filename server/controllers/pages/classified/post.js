var classified = require('../../../models/classified'),
	config = require('../../../../var/config'),
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
		response.contentType('application/json');

		if (!request.isAuthenticated()) {
			response.status(401);
			return response.end();
		}

		function captachFail() {
			response.status(401);
			response.end();
		}

		function captachSuccess() {
			classified.create(request.body, request.user, function(cl) {
				/* If a classified was saved, then return it to the client. The
				 * returned classified will contain the id parameter which
				 * wasn't there before. */
				if(cl) return response.end(JSON.stringify(cl));

				/* If no classified was returned, then nothing was saved. So
				 * send a 400 Bad Request to the client */
				response.status(400);
				response.end();
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
	},

	doUpload: function(request, response, next) {
		var asyncTasks = [], ret = {};

		/* Initialize formidable */
		var form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.maxFieldsSize = 4 * 1024 * 1024; /* 4MB */

		/* Start parsing the form */
		form.parse(request, function(err, fields, files) {
			ret = fields;
			ret.images = [];
			var files = files["files[]"];

			/* Avoid reading empty file uploads */
			if(!files || files.length == 0) return callback(null);

			for(var i=0; i<files.length; i++) {
				var f = files[i];
				var newFilename = file.createUniqueFilename(f.path);
				var uploadPath = file.uploadDir + newFilename;

				/* Avoid uploading with invalid filenames */
				if(!newFilename) continue;

				/* Set this accordingly */
				var isValid = file.validate(f);

				/* Add a task to operate on this file */
				asyncTasks.push({
					oldPath: f.path,
					newPath: uploadPath,
					newFilename: newFilename,
					isValid: isValid
				});

				/* Add the file into our list of 'accpeted' files */
				if(isValid) ret.images.push(newFilename);
			}

			/* Perform file operations to move the file from the temporary
			 * storage into the public uploads folder.
			 *
			 * Note that this is done asynchronously. Which is quite neat since
			 * we don't have to wait for the files to get uploaded and can
			 * continue to continue performing operations on the DB. */
			file.operate(asyncTasks);

			/* Call the callback function with the list of uploaded files */
			response.end(JSON.stringify(ret));
		});
	}
}