###*
 * This module is responsible for only one thing; Performing file uploads. More
 * specifically image uploads for a classified. It takes care of doing things
 * like compressing the image, validating it, creating thumbnails etc while
 * at the same time doing it all asynchronously.
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise     = require "bluebird"
async       = require "async"
colorThief  = require "color-thief"
formidable  = require "formidable"
fs          = require "fs"
gm          = require "gm"
mv          = require "mv"
path        = require "path"


MAX_FILE_SIZE = 6 * 1024 * 1024 # 6MB
MAX_FILES_PER_UPLOAD = 12

IMAGE_MAXSIZE_MAIN = 1500 # 1500px x 1500px
IMAGE_MAXSIZE_THUMB = 400 # 400px x 400px

THUMBNAIL_DIR = "/uploads/thumb"
MAINIMAGE_DIR = "/uploads/main"


###*
 * Returns the extension of the given filename. TODO: Find path's equivalent.
 *
 * @param  String filename      The filename for the given file.
 *
 * @return String               The extension
###
_getExtension = (filename) -> (/(?:\.([^.]+))?$/.exec filename)[1] or "jpeg"



###*
 * Helper function to get the dominant colour for the given image
 *
 * @param  String filepath       A path to the image file to which the most
 *                               dominant color has to be read.
 * @required filepath
 *
 * @return String                A hex representation of the most dominant
 *                               color.
 *
 * @example
 * _getDominantColor("red.jpg") -> "#FF0000"
###
_getDominantColor = (filepath) ->
  rgbToHex = (rgb) ->
    componentToHex = (c) ->
      hex = c.toString 16
      if hex.length == 1 then "0#{hex}" else hex
    "##{componentToHex rgb[0]}#{componentToHex rgb[1]}#{componentToHex rgb[2]}"

  thief = new colorThief()
  rgbToHex thief.getColor filepath


###*
 * Creates a unique filename from the given one, by keeping the extension of
 * the previous filename, and replacing all the characters before the extension
 * of it with the date and a random string that is 5 characters long.
 *
 * This gives a probability of a filename collision to be 1/3^63 according
 * the algorithm that is being used. [Assuming that 3^63 files get uploaded
 * at the same millisecond].
 *
 * @param  String filename      The filename which is to given a unique name
 * @required filename
 *
 * @return String               A string that contains the same extension as the
 *                              original fiqle but contains a unique id.
 *
 * @example
 * _createUniqueFilename("abc.jpg") -> "201551519713678-3af.jpg"
###
_createUniqueFilename = (filename) ->
  # Get the file's extension
  extension = _getExtension filename

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
  makeUniqueString = (length) ->
    text = ""
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    i = 0
    while i < length
      text += possible.charAt Math.floor Math.random() * possible.length
      i++
    text

  "#{timestamp}-#{makeUniqueString 3}.#{extension}"


###*
* This function is a helper function that checks if the given files is a
* valid file for upload or not. It checks the size, extension and type for
* now.
*
* @param File file        The file object which is to be validated
*
* @return Boolean         Returns True iff the file is good to be uploaded.
*
* TODO: Work on this because this is vulnerable to shellcode attacks..
###
validate = (file) ->
  status = true

  # Check on the 6MB limit per file
  if not (0 < file.size < (MAX_FILE_SIZE)) then status = false

  # Check for invalid filetype
  if not file.type in ["image/gif", "image/png", "image/jpg",
  "image/jpeg"] then status = false

  status


exports = module.exports = (settings) ->
  # Setup some defaults
  thumbsDir = "#{settings.publicDir}#{THUMBNAIL_DIR}"
  uploadDir = "#{settings.publicDir}#{MAINIMAGE_DIR}"


  ###*
  * Given the asynchronous tasks for this function, perform them. Delete
  * the temporary file if "isValid" is false; Move the temporary file
  * into permanent storage if "isValid" is true.
  *
  * We do this asynchronously and wait for all the files to be uploaded. Once
  * we are done we create another asynchronous task to start creating
  * thumbnails. For more explanation see the code
  *
  * WARN: Because we are using command-line 'mv' command there is always the
  * risk of having shellcode getting through. Although I'm only aware of
  * having PHP shellcode, the CDN serves the images which (unlike the main
  * server) could be running a PHP (+ NGINX) parser. Make this more secure.
  *
  * @param Array tasks                The tasks that have been set from the
  *                                   upload function. Each task should be an
  *                                   object containing a newPath, oldPath
  *                                   and newFilename key.
  *
  * @return Promise                   A promise that resolves once the images
  *                                   have been uploaded and the thumbnails have
  *                                   been created.
  ###
  operate = (tasks) -> new Promise (resolve, reject) ->
    # Start analyzing each file and either upload or delete it
    asyncJob = (task, finish) ->
      # Sometimes you do hit this condition. In which case we simply ignore
      # performing any file operations..
      if not task.oldPath then finish()

      if task.isValid
        # Compress the image, ('Lossless' is my favorite..) and write it to it's
        # destination
        gm task.oldPath
        .resize IMAGE_MAXSIZE_MAIN, IMAGE_MAXSIZE_MAIN
        .compress "Lossless"
        .autoOrient()
        .write task.newPath, finish

      # Delete the file from our temporary storage
      else fs.unlink task.oldPath, finish


    # Now start creating the thumbnails asynchronously
    asyncFinish = (error) ->
      if error then reject error
      else resolve createThumbnails tasks

    # Start the async tasks
    async.each tasks, asyncJob, asyncFinish


  ###*
  * Creates the thumbnails asynchronously. We need to do this in async too
  * because the function that we use is single-threaded and does not support
  * callback functions. This is bad for us, so we work around by using the
  * async module.
  *
  * What's more is that we need to wait for all the files to be uploaded
  * before we start making the thumbnails, since we don't want to work on
  * empty files. So that's why we needed to make another async call on the
  * previous function, to give us the signal that the file upload is over.
  *
  * @param Array tasks         An array of tasks that was passed to the operate
  *                            function.
  *
  * @return Promise            A promise that resolves iff the thumbnails could
  *                            be created.
  ###
  createThumbnails = (tasks) -> new Promise (resolve, reject) ->
    # For each image, asynchronously run this function
    asyncJob = (task, finish) ->
      if task.isValid
        # Then create the thumbnail
        gm task.newPath
        .resize IMAGE_MAXSIZE_THUMB, IMAGE_MAXSIZE_THUMB
        .crop IMAGE_MAXSIZE_THUMB, IMAGE_MAXSIZE_THUMB, 0, 0
        .autoOrient()
        .write "#{path.normalize thumbsDir}/#{task.newFilename}", finish

    # Execute the async call..
    asyncFinish = (error) -> if error then reject error else resolve()
    async.each tasks, asyncJob, asyncFinish


  new class Uploader
    ###*
    * Starts the upload of files into the server. It makes sure that the files
    * are valid files (using validation logic in the function below this one)
    * and does not exceed the files per limit.
    *
    * It does the file uploads (asynchronously) and at the same time creates
    * the thumbnails for each image (asynchronously too).
    *
    * @param Array files       An array of file object that have to uploaded.
    * @param Object options    Options that get used during the file upload.
    *
    * @return Promise          Returns a promise that resolves with an array
    *                          of successfully uploaded files (with the dominant
    *                          color and new/old file paths).
    ###
    upload: (files=[], options={}) ->
      asyncTasks = []
      ret = []

      # Files uploads that have only one file, get passed as an object, so we
      # recast it into an array to avoid breaking our iterators..
      if not files.length? then files = [files]

      # Avoid reading empty file uploads.
      if files.length is 0 then return Promise.resolve []

      # Find if there is any file prefix set (used to rename images under
      # a classified's id).
      if options.prefix then prefix = "#{options.prefix}-"
      else prefix = ""

      # Start iterating through each file
      for file in files
        # First, check if the file is valid or not
        isValid = validate file

        # Then check if we have exceed our files per classified limit. If
        # so then mark all files, starting from this file onwards as invalid
        if asyncTasks.length >= MAX_FILES_PER_UPLOAD then isValid = false

        # Add a task to operate on this file
        newFilename = "#{prefix}#{_createUniqueFilename file.path}"
        uploadPath = "#{uploadDir}/#{newFilename}"
        asyncTasks.push
          isValid: isValid
          newFilename: newFilename
          newPath: path.normalize uploadPath
          oldPath: file.path

        # If the file is valid, then call the dominant color fn;
        dominantColor = if isValid then _getDominantColor file.path

        # Add the file into our list of processed files.
        ret.push
          color: dominantColor
          isUploaded: isValid
          newFilename: newFilename
          oldFilename: file.name

      console.log ret
      # Perform file operations to move the file from the temporary
      # storage into the public uploads folder.
      operate asyncTasks

      # Once the files have been saved, we resolve our promise with the list of
      # images.
      .then -> ret


    ###*
    * A quick function to delete the files at the given locations.
    *
    * TODO: test this function
    *
    * @param array files            An array of files that need to be deleted.
    *                               Each array item follows the same object
    *                               hierarchy as the ones that passed in the
    *                               operate function.
    *
    * @return Promise               A promise that resolves iff the files were
    *                               successfully deleted.
    ###
    delete: (files) -> new Promise (resolve, reject) ->
      asyncJob = (filepath, finish) ->
        # Prepare the functions to remove the files
        removeImage = (callback) ->
          fs.unlink "#{uploadDir}/#{filepath}", callback
        removeThumbnail = (callback) ->
          fs.unlink "#{thumbsDir}/#{filepath}", callback

        # create the async job that will remove the files. Because we don't
        # expect to have any other errors than OS related errors, we wrap this
        # job inside async's retry.
        retryJob = (finish) ->
          async.parallel [removeImage, removeThumbnail], finish

        # Attempt the remove the files while retrying for 3 times on any error.
        async.retry 3, retryJob, finish

      # For each file in the list, attempt to remove it's thumbnail and main
      # image.
      async.each files, asyncJob, (error, result) ->
        if error then reject error
        else resolve result


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true
