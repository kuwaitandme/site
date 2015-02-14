var async = require('async'),
	fs = require('fs'),
	easyimg = require('easyimage'),
	formidable = require('formidable');

module.exports = {
	uploadDir: __dirname + '/../../public/uploads/',
	thumbsDir: __dirname + '/../../public/uploads/thumb/',

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
	 * This gives a probability of a filename collision should be 14^63 as per
	 * the algorithm that is being used.
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

			/* Avoid reading empty file uploads */
			if(!files || files.length == 0) return callback(null);

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
					newFilename: newFilename,
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
			that.operate(asyncTasks);

			/* Call the callback function with the list of uploaded files */
			callback(uploadedFiles);
		});
	},


	/**
	 * Given the asynchronous tasks for this function, perform them. Delete
	 * the temporary file if 'isValid' is false; Move the temporary file
	 * into permanent storage if 'isValid' is true.
	 *
	 * We do this asynchronously and wait for all the files to be uploaded. Once
	 * we are done we create another asynchronous task to start creating
	 * thumbnails. For more explanation see below function.
	 *
	 * @param  tasks     An array of task objects defined in the above function.
	 */
	operate: function(tasks) {
		var that = this;

		/* Start analyzing each file and either upload or delete it */
		asyncJob = function(task, finish) {
			if(task.isValid) {
				/* Copy the file into the upload path if the file is valid */
				fs.rename(task.oldPath, task.newPath, function(err) {
					if (err) throw err;
					finish();
				});
			} else {
				/* Delete the file from our temporary storage if it isin't
				 * valid */
				fs.unlink(task.oldPath, function(err) {
					if (err) throw err;
					finish();
				});
			}
		};

		/* Now start creating the thumbnails asynchronously */
		asyncFinish = function() {
			that.createThumbnails(tasks);
		};

		async.each(tasks, asyncJob, asyncFinish);
	},


	/**
	 * Creates the thumbnails asynchronously. We need to do this in async too
	 * because the function that we use is single-threaded and does not support
	 * callback functions. This is bad for us, so we work around by using the
	 * async module.
	 *
	 * What's more is that we need to wait for all the files to be uploaded
	 * before we start making the thumbnails, since we don't want to work on
	 * empty files. So that's we needed to make another async call on the
	 * previous function, to give us the signal that the file upload is over.
	 *
	 * @param  tasks     An array of task objects defined in the above function.
	 */
	createThumbnails: function(tasks) {
		var that = this;

		asyncJob = function(task, finish) {
			if(task.isValid) {
				/* Create the thumbnails for the image */
				easyimg.rescrop({
					src: task.newPath,
					dst: that.thumbsDir + task.newFilename,
					width:300, height:300,
					cropwidth:150, cropheight:150,
					x:0, y:0
				});
			}

			finish();
		};

		asyncFinish = function() { };
		async.each(tasks, asyncJob, asyncFinish);
	}
}