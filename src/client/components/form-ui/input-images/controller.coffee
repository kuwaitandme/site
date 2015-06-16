exports = module.exports = ($scope, $element, $imageResizer, $log) ->

  # Function to popup the file selector dialog
  $scope.addImages = ->
    $fileInput = $element[0].querySelectorAll "[type='file']"
    $fileInput[0].click()


  # This function is called when files have been selected by the user. Here we
  # pass the files into our imageResizer for resizing into nice square
  # thumbnails.
  $scope.fileChange = (files=[]) ->
    $scope.images ?= []
    for file in files
      # For every new image that is added, run this function. Because the
      # 'createThumnail' function is async, this causes the file reference in
      # the internal callback function to refer to the last element in the
      # files array (because of the loop). Hence we have to generate a function
      # passing the specific reference of the file.
      ((file) -> $imageResizer.createThumbnail file,
        thumbnailHeight: 300
        thumbnailWidth: 300
        callback: (dataURL) -> $scope.$apply ->
          # Check if this image is a valid candidate for the main image. If it
          # is then make it the main image, otherwise don't. The logic written
          # below follows this.
          isThereMainImage = false
          (if img.main then isThereMainImage = true) for img in $scope.images
          $scope.images.push
            file: file
            filename: file.name
            height: file.height
            main: not isThereMainImage
            src: dataURL
            status: "to-upload"
            width: file.width
      ) file


  # Handler function to remove the file from the Uploads queue
  $scope.removeImage = ($index) ->
    image = $scope.images[$index]
    # Decide which should be the new status for the image
    switch image.status
      when "on-server"             then image.status = "to-delete-from-server"
      when "to-delete"             then image.status = "to-upload"
      when "to-delete-from-server" then image.status = "on-server"
      when "to-upload"             then image.status = "to-delete"
    # Don't allow this image to be the main image if it is to be deleted
    if image.main
      # First remove this image as the main one
      image.main = false
      # Then search and set for the first image that is not to be deleted as the
      # main image
      for img in $scope.images
        if img.status in ["on-server", "to-upload"]
          img.main = true
          break


  # Handler function to set the main image. Updates the main image to be the
  # image that the user just clicked.
  $scope.setmainImage = ($index) ->
    image = $scope.images[$index]
    # Don't do anything if the image was set to be deleted
    if image.status in ["to-delete-from-server", "to-delete"] then return
    # First tag all images as not the main image
    img.main = false for img in $scope.images
    # And then tag our specific image as the main image
    image.main = true


exports.$inject = [
  "$scope"
  "$element"
  "$imageResizer"
  "$log"
]
