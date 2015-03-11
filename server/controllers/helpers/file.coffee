async = require('async')
fs = require('fs')
easyimg = require('easyimage')
formidable = require('formidable')

file = module.exports =
	uploadDir: __dirname + '/../../../public/uploads/'
	thumbsDir: __dirname + '/../../../public/uploads/thumb/'


	# Returns the extension of the given filename
	getExtension: (filename) ->
		re = /(?:\.([^.]+))?$/
		re.exec(filename)[1]


	# Creates a unique filename from the given one, by keeping the extension of
	# the previous filename, and replacing all the characters before the
	# extension of it with a random string that is 14 characters long.
	#
	# This gives a probability of a filename collision should be 14^63 as per
	# the algorithm that is being used.
	createUniqueFilename: (filename) ->
		extension = @getExtension(filename)
		if not extension then return false

		# Creates a unique string, that is 'length' characters long.`
		makeUniqueId = (length) ->
			text = ''
			possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

			i = 0
			while i < length
				text += possible.charAt(Math.floor(Math.random() * possible.length))
				i++
			text

		makeUniqueId(14) + '.' + @getExtension(filename)



	# Starts the upload of files into the server. It makes sure that
	#
	# TOODODODOODODO
	upload: (files, callback) ->
		asyncTasks = []
		ret = []

		# Avoid reading empty file uploads`
		if not files or files.length == 0 then return callback(null)

		i = 0
		while i < files.length
			f = files[i]
			newFilename = file.createUniqueFilename(f.path)
			uploadPath = file.uploadDir + newFilename
			if !newFilename
				i++
				continue

			# Set this accordingly`
			isValid = true

			# Add a task to operate on this file`
			asyncTasks.push
				oldPath: f.path
				newPath: uploadPath
				newFilename: newFilename
				isValid: isValid

			# Add the file into our list of 'accepted' files`
			if isValid then ret.push newFilename

			i++

		# Perform file operations to move the file from the temporary
		# storage into the public uploads folder.
		#
		# Note that this is done asynchronously. Which is quite neat since
		# we don't have to wait for the files to get uploaded and can
		# continue to continue performing operations on the DB.
		file.operate asyncTasks

		# Call the callback function with the list of uploaded files`
		callback ret


	validate: (file) -> true


	# Given the asynchronous tasks for this function, perform them. Delete
	# the temporary file if 'isValid' is false; Move the temporary file
	# into permanent storage if 'isValid' is true.
	#
	# We do this asynchronously and wait for all the files to be uploaded. Once
	# we are done we create another asynchronous task to start creating
	# thumbnails. For more explanation see below function.
	operate: (tasks) ->

		# Start analyzing each file and either upload or delete it`
		asyncJob = (task, finish) ->
			if task.isValid

				# Copy the file into the upload path if the file is valid`
				fs.rename task.oldPath, task.newPath, (err) ->
					if err then throw err
					finish()

			else
				# Delete the file from our temporary storage if it isn't valid
				fs.unlink task.oldPath, (err) ->
					if err then throw err
					finish()


		# Now start creating the thumbnails asynchronously`
		asyncFinish = -> file.createThumbnails tasks

		# Start the async tasks
		async.each tasks, asyncJob, asyncFinish


	# Creates the thumbnails asynchronously. We need to do this in async too
	# because the function that we use is single-threaded and does not support
	# callback functions. This is bad for us, so we work around by using the
	# async module.
	#
	# What's more is that we need to wait for all the files to be uploaded
	# before we start making the thumbnails, since we don't want to work on
	# empty files. So that's we needed to make another async call on the
	# previous function, to give us the signal that the file upload is over.
	createThumbnails: (tasks) ->
		asyncJob = (task, finish) ->
			if task.isValid
				# Create the thumbnails for the image`
				easyimg.rescrop
					dst: file.thumbsDir + task.newFilename
					src: task.newPath
					width: 350
					x: 0
					y: 0
			finish()


		asyncFinish = ->

		async.each tasks, asyncJob, asyncFinish