exports = module.exports = ($scope) ->

  # Function to popup the file selector dialog
  $scope.addImages = ->
    $fileInput = $element[0].querySelectorAll "[type='file']"
    $fileInput[0].click()

  # This function is called when files have been selected by the user. Here we
  # pass the files into our imageResizer for resizing into nice square
  # thumbnails.
  $scope.fileChange = (files=[]) ->
    $scope.classified.images = [] if not $scope.classified.images?
    for file in files
      # For every new image that is added, run this function. Because the
      # 'createThumnail' function is async, this cases the file reference in
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
          for image in $scope.classified.images
            if image.main then isThereMainImage = true
          $scope.classified.images.push
            file: file
            filename: file.name
            height: file.height
            main: not isThereMainImage
            src: dataURL
            status: "to-upload"
            width: file.width
      ) file

  # Handler function to remove the file from the Uploads queue
  $scope.removeImage = ($event) ->
    $li = angular.element $event.target.parentNode
    # Decide which should be the new status for the image
    switch $li.data().$scope.image.status
      when "on-server"             then newStatus = "to-delete-from-server"
      when "to-delete"             then newStatus = "to-upload"
      when "to-delete-from-server" then newStatus = "on-server"
      when "to-upload"             then newStatus = "to-delete"
    if newStatus? then $li.data().$scope.image.status = newStatus
    # Don't allow this image to be the main image if it is to be deleted
    if $li.data().$scope.image.main
      for image in $scope.classified.images
        if image.status in ["on-server", "to-upload"]
          image.main = true
          break
      $li.data().$scope.image.main = false

  # Handler function to set the main image. Updates the main image to be the
  # image that the user just clicked.
  $scope.setmainImage = ($event) ->
    $li = angular.element $event.target.parentNode
    # Don't do anything if the image was set to be deleted
    if $li.data().$scope.image.status in ["to-delete-from-server", "to-delete"]
      return
    # First tag all images as not the main image
    image.main = false for image in $scope.classified.images
    # And then tag our specific image as the main image
    $li.data().$scope.image.main = true


exports = [
  "$scope"
]
