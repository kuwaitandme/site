async       = require "async"
formidable  = require "formidable"
fs          = require "fs"
gm          = require "gm"
ColorThief  = require "color-thief"
path        = require "path"

# This module is responsible for only one thing; Performing file uploads. More
# specifically image uploads for a classified. It takes care of doing things
# like compressing the image, validating it, creating thumbnails etc while
# at the same time doing it all asynchronously.
exports = module.exports = (settings) ->
  class uploader
    constructor = ->
      @maxFiles = 12
      @thumbsDir = "#{settings.appDir}/uploads/thumb"
      @uploadDir = "#{settings.appDir}/uploads/main"

    # Returns the extension of the given filename
    getExtension: (filename) -> (/(?:\.([^.]+))?$/.exec filename)[1] or "jpeg"

    getDominantColor: (filepath) ->
      rgbToHex = (rgb) ->
        componentToHex = (c) ->
          hex = c.toString 16
          if hex.length == 1 then "0#{hex}" else hex
        "##{componentToHex rgb[0]}#{componentToHex rgb[1]}#{componentToHex rgb[2]}"

      colorThief = new ColorThief()
      rgbToHex colorThief.getColor filepath


    # Creates a unique filename from the given one, by keeping the extension of
    # the previous filename, and replacing all the characters before the
    # extension of it with a random string that is 14 characters long.
    #
    # This gives a probability of a filename collision should be 14^63 as per
    # the algorithm that is being used.
    createUniqueFilename: (filename) ->
      extension = @getExtension filename

      # Creates a unique string, that is "length" characters long.
      makeUniqueId = (length) ->
        text = ""
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        i = 0
        while i < length
          text += possible.charAt Math.floor (Math.random() * possible.length)
          i++
        text

      "#{makeUniqueId 14}.#{@getExtension filename}"


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

      console.log files

      # Start iterating through each file
      for f in files
        # First, check if the file is valid or not
        isValid = @validate f

        # Then check if we have exceed our files per classified limit. If
        # so then mark all files, starting from this file onwards as invalid
        if asyncTasks.length >= @maxFiles then isValid = false

        # Add a task to operate on this file
        newFilename = file.createUniqueFilename f.path
        uploadPath = "#{file.uploadDir}/#{newFilename}"
        asyncTasks.push
          isValid: isValid
          newFilename: newFilename
          newPath: path.normalize uploadPath
          oldPath: f.path

        # Add the file into our list of "accepted" files and get it"s dominant
        # color.
        if isValid then ret.push
          file: newFilename
          color: @getDominantColor f.path

      # Perform file operations to move the file from the temporary
      # storage into the public uploads folder.
      #
      # Note that this is done asynchronously. Which is quite neat since
      # we don"t have to wait for the files to get uploaded and can
      # continue to continue performing operations on the DB.
      file.operate asyncTasks

      # Call the callback function with the list of uploaded files
      callback null, ret


    # A quick function to delete the files at the given locations.
    #
    # TODO: test this function
    delete: (files) ->
      asyncJob = (filepath, finish) ->
        # Prepare the functions to remove the files
        removeImage = (callback) ->
          fs.unlink "#{file.uploadDir}/#{filepath}", callback
        removeThumbnail = (callback) ->
          fs.unlink "#{file.thumbsDir}/#{filepath}", callback

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
      console.log tasks
      # Start analyzing each file and either upload or delete it
      asyncJob = (task, finish) ->

        if task.isValid
          # Copy the file into the upload path if the file is valid
          fs.rename task.oldPath, task.newPath, (error) -> finish error

        # Delete the file from our temporary storage
        else fs.unlink task.oldPath, (error) -> finish error


      # Now start creating the thumbnails asynchronously
      asyncFinish = -> file.createThumbnails tasks

      # Start the async tasks
      async.each tasks, asyncJob, asyncFinish


    # Creates the thumbnails asynchronously. We need to do this in async too
    # because the function that we use is single-threaded and does not support
    # callback functions. This is bad for us, so we work around by using the
    # async module.
    #
    # What"s more is that we need to wait for all the files to be uploaded
    # before we start making the thumbnails, since we don"t want to work on
    # empty files. So that"s we needed to make another async call on the
    # previous function, to give us the signal that the file upload is over.
    createThumbnails: (tasks) ->
      asyncJob = (task, finish) ->
        if task.isValid

          # First compress the image
          gm task.newPath
          .compress "BZip"
          .resize 1500, 1500
          .autoOrient()
          .write task.newPath, (error) ->
            if error then return finish error

            # Then create the thumbnail
            gm task.newPath
            .resize 400, 400
            .crop 400, 400, 0, 0
            .autoOrient()
            .write "#{path.normalize file.thumbsDir}/#{task.newFilename}", finish

      async.each tasks, asyncJob, ->

  new uploader


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true