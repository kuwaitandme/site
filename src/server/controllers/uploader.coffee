async       = require "async"
colorThief  = require "color-thief"
formidable  = require "formidable"
fs          = require "fs"
gm          = require "gm"
mv          = require "mv"
path        = require "path"

# This module is responsible for only one thing; Performing file uploads. More
# specifically image uploads for a classified. It takes care of doing things
# like compressing the image, validating it, creating thumbnails etc while
# at the same time doing it all asynchronously.
exports = module.exports = (settings) ->
  class uploader
    maxFiles: 12
    thumbsDir: "#{settings.publicDir}/uploads/thumb"
    uploadDir: "#{settings.publicDir}/uploads/main"

    # Returns the extension of the given filename
    _getExtension: (filename) -> (/(?:\.([^.]+))?$/.exec filename)[1] or "jpeg"


    # Helper function to get the dominant colour for the given image
    _getDominantColor: (filepath) ->
      rgbToHex = (rgb) ->
        componentToHex = (c) ->
          hex = c.toString 16
          if hex.length == 1 then "0#{hex}" else hex
        "##{componentToHex rgb[0]}#{componentToHex rgb[1]}#{componentToHex rgb[2]}"

      thief = new colorThief()
      rgbToHex thief.getColor filepath


    # Creates a unique filename from the given one, by keeping the extension of
    # the previous filename, and replacing all the characters before the
    # extension of it with the date and a random string that is
    # 5 characters long.
    #
    # This gives a probability of a filename collision should be 10^63 as per
    # the algorithm that is being used. [Assuming that 5^63 files get uploaded
    # at the same millisecond]
    _createUniqueFilename: (filename) ->
      # Get the file's extension
      extension = @_getExtension filename

      # Create the timestamp component
      date = new Date()
      components = [
        date.getFullYear()
        date.getMonth()
        date.getDate()
        date.getHours()
        date.getMinutes()
        date.getSeconds()
        date.getMilliseconds()
      ]
      timestamp = components.join ""

      # Creates a unique string, that is 'length' characters long.
      makeUniqueId = (length) ->
        text = ""
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        i = 0
        while i < length
          text += possible.charAt Math.floor Math.random() * possible.length
          i++
        text

      "#{timestamp}-#{makeUniqueId 10}.#{extension}"


    # Starts the upload of files into the server. It makes sure that the files
    # are valid files (using validation logic in the function below this one)
    # and does not exceed the files per limit.
    #
    # It does the file uploads (asynchronously) and at the same time creates
    # the thumbnails for each image (asynchronously too).
    upload: (files, callback) ->
      asyncTasks = []
      ret = []

      # Avoid reading empty file uploads
      if not files? then return callback()
      if files.length? and files.length == 0 then return callback()

      # Files uploads that have only one file, get passed as an object, so
      # recast it into an array.
      if not files.length? then files = [files]

      # Start iterating through each file
      for file in files
        # First, check if the file is valid or not
        isValid = @validate file

        # Then check if we have exceed our files per classified limit. If
        # so then mark all files, starting from this file onwards as invalid
        if asyncTasks.length >= @maxFiles then isValid = false

        # Add a task to operate on this file
        newFilename = @_createUniqueFilename file.path
        uploadPath = "#{@uploadDir}/#{newFilename}"
        asyncTasks.push
          isValid: isValid
          newFilename: newFilename
          newPath: path.normalize uploadPath
          oldPath: file.path

        # If the file is valid, then call the dominant color fn;
        dominantColor = if isValid then @_getDominantColor file.path

        # Add the file into our list of processed files.
        ret.push
          color: dominantColor
          isUploaded: isValid
          newFilename: newFilename
          oldFilename: file.name

      # Perform file operations to move the file from the temporary
      # storage into the public uploads folder.
      #
      # Note that this is done asynchronously. Which is quite neat since
      # we don't have to wait for the files to get uploaded and can
      # continue to continue performing operations on the DB.
      @operate asyncTasks

      # Call the callback function with the list of uploaded files
      callback null, ret


    # A quick function to delete the files at the given locations.
    #
    # TODO: test this function
    delete: (files) ->
      asyncJob = (filepath, finish) =>
        # Prepare the functions to remove the files
        removeImage = (callback) =>
          fs.unlink "#{@uploadDir}/#{filepath}", callback
        removeThumbnail = (callback) =>
          fs.unlink "#{@thumbsDir}/#{filepath}", callback

        # create the async job that will remove the files
        retryJob = (finish) ->
          async.parallel [removeImage, removeThumbnail], finish

        # Attempt the remove the files while retrying for 3 times on any
        # error.
        async.retry 3, retryJob, finish

      # For each file in the list, attempt to remove it"s thumbnail and
      # main image.
      #
      # Here we really don"t care about the errors that will come. So our
      # error handler is a blank function.
      async.each files, asyncJob, (error, result) ->


    # This function is a helper function that checks if the given files is a
    # valid file for upload or not. It checks the size, extension and type for
    # now.
    validate: (file) ->
      status = true

      # 10MB limit per file
      if not (0 < file.size < (4 * 1024 * 1024)) then status = false

      # Invalid filetype
      if not file.type in ["image/gif", "image/png", "image/jpg",
      "image/jpeg"] then status = false

      status


    # Given the asynchronous tasks for this function, perform them. Delete
    # the temporary file if "isValid" is false; Move the temporary file
    # into permanent storage if "isValid" is true.
    #
    # We do this asynchronously and wait for all the files to be uploaded. Once
    # we are done we create another asynchronous task to start creating
    # thumbnails. For more explanation see below function.
    operate: (tasks) ->
      # Start analyzing each file and either upload or delete it
      asyncJob = (task, finish) ->
        if task.isValid
          # Copy the file into the upload path if the file is valid
          mv task.oldPath, task.newPath, (error) -> finish error

        # Delete the file from our temporary storage
        else fs.unlink task.oldPath, (error) -> finish error


      # Now start creating the thumbnails asynchronously
      asyncFinish = => @createThumbnails tasks

      # Start the async tasks
      async.each tasks, asyncJob, asyncFinish


    # Creates the thumbnails asynchronously. We need to do this in async too
    # because the function that we use is single-threaded and does not support
    # callback functions. This is bad for us, so we work around by using the
    # async module.
    #
    # What's more is that we need to wait for all the files to be uploaded
    # before we start making the thumbnails, since we don't want to work on
    # empty files. So that"s we needed to make another async call on the
    # previous function, to give us the signal that the file upload is over.
    createThumbnails: (tasks) ->
      asyncJob = (task, finish) =>
        if task.isValid
          # First compress the image, 'Lossless' is my favorite..
          gm task.newPath
          .resize 1500, 1500
          .compress "Lossless"
          .autoOrient()
          .write task.newPath, (error) =>
            if error then return finish error

            # Then create the thumbnail
            gm task.newPath
            .resize 400, 400
            .crop 400, 400, 0, 0
            .autoOrient()
            .write "#{path.normalize @thumbsDir}/#{task.newFilename}", finish

      async.each tasks, asyncJob, ->


  new uploader


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true