var async = require('async'),
	fs = require('fs'),
	formidable = require('formidable');

module.exports = {
	uploadDir: __dirname + '/../../public/uploads/',

	/**
	 * Returns the extension of the given filename
	 */
	getExtension: function(filename) {
		var re = /(?:\.([^.]+))?$/;
		return re.exec(filename)[1];
	},


	/**
	 * Creates a unique filename from the given one, by keeping the extension of
	 * the previous filename, and replacing all the characters before the
	 * extension of it with a random string that is 14 characters long.
	 *
	 * This gives a probability of a filename collision to be 14^63 as per the
	 * algorithm that is being used.
	 */
	createUniqueFilename: function(filename) {
		/* Creates a unique string, that is 'length' characters long. */
		function makeUniqueId(length) {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for(var i=0; i<length; i++) text += possible.charAt(
				Math.floor(Math.random() * possible.length));
			return text;
		}

		return makeUniqueId(14) + "." + this.getExtension(filename);
	},


	/**
	 * Starts the upload of files into the server. It makes sure that
	 *
	 * @param  request    The 'request' variable containing the form file data.
	 * @param  callback   The callback function to call once done. This function
	 *                    takes in an array of new filenames of the files that
	 *                    have been uploaded.
	 */
	upload: function(request, callback) {
		var uploadedFiles = [];
		var asyncTasks = [];
		var that = this;

		/* Initialize formidable */
		var form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.maxFieldsSize = 4 * 1024 * 1024; /* 4MB */

		form.on('fileBegin', function(name, file) {
			/* Perform some validation and upload the file */
			// console.log(name, file);
		});

		/* Start parsing the form */
		form.parse(request, function(err, fields, files) {
			var files = files["files[]"];

			if(files.length == 0) return callback(null);

			for(var i=0; i<files.length; i++) {
				var f = files[i];
				var newFilename = that.createUniqueFilename(f.path);
				var uploadPath = that.uploadDir + newFilename;

				/* Set this accordingly */
				var isValid = true;

				/* Add a task to operate on this file */
				asyncTasks.push({
					oldPath: f.path,
					newPath: uploadPath,
					isValid: isValid
				});

				/* Add the file into our list of 'accpeted' files */
				if(isValid) uploadedFiles.push(newFilename);
			}

			/* Perform file operations to move the file from the temporary
			 * storage into the public uploads folder.
			 *
			 * Note that this is done asynchronously. Which is quite neat since
			 * we don't have to wait for the files to get uploaded and can
			 * continue to continue performing operations on the DB. */
			operate(asyncTasks);

			/* Call the callback function with the list of uploaded files */
			callback(uploadedFiles);
		});


		/* Given the asynchronous tasks for this function, perform them. Delete
		 * the temporary file if 'isValid' is false; Move the temporary file
		 * into permanent storage if 'isValid' is true. */
		function operate(tasks) {
			for(var i=0; i<tasks.length; i++) {
				var task = tasks[i];

				if(task.isValid) {
					/* Copy the file into the upload path if the file is valid */
					fs.rename(task.oldPath, task.newPath, function(err) {
						if (err) throw err;
					});
				} else {
					/* Delete the file from our temporary storage if it isin't
					 * valid */
					fs.unlink(task.oldPath, function(err) {
						if (err) throw err;
					});
				}
			}
		}
	},
}