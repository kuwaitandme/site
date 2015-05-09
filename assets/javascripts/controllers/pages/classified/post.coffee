## TODO: Add automatic resize of content
exports = module.exports = ($scope, $googleMaps, $imageResizer,
  $location, console, Classified, Category, Location) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"

  $scope.categories = Category.getAll()
  $scope.locations = Location.getAll()

  # If classified is not defined, then set it to it's default values. By scope
  # inheritance if there was a classified in the parent controller, it should
  # override this line.
  $scope.classified ?= Classified.getDefault()

  # Function to listen for changes with classified title
  titleChange = (newValue="") ->
    minTitle = 20
    maxTitle = 140
    if minTitle <= newValue.length <= maxTitle
      remaining = maxTitle - newValue.length
      $scope.remainingTitle = "#{remaining} characters left"
    else $scope.remainingTitle = ""
  $scope.$watch "classified.title", titleChange

  # Function to listen for changes with classified description
  descriptionChange = (newValue="") ->
    minDescription = 50
    maxDescription = 2000
    if minDescription <= newValue.length <= maxDescription
      remaining = maxDescription - newValue.length
      $scope.remainingDescription = "#{remaining} characters left"
    else $scope.remainingDescription = ""
  $scope.$watch "classified.description", descriptionChange

  # Function to popup the file selector dialog
  $scope.addImages = ->
    $el = angular.element document.querySelectorAll "[type='file']"
    $el[0].click()

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
      ((file)-> $imageResizer.createThumbnail file,
        thumbnailHeight: 300
        thumbnailWidth: 300
        callback: (dataURL) => $scope.$apply ->
          # Check if this image is a valid candidate for the main image. If it
          # is then make it the main image, otherwise don't. The logic written
          # below follows this.
          isThereMainImage = false
          for image in $scope.classified.images
            if image.main then isThereMainImage = true
          $scope.classified.images.push
            file: file
            main: not isThereMainImage
            status: "to-upload"
            thumb: dataURL
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

  # This function handlers when the form gets submitted.
  $scope.submit = ->
    # Only perform the submit function if the form has validated properly
    if not $scope.form.$invalid
      console.log @name, "submitting form"
      if $scope.parentCategory?
        $scope.classified.parent_category = $scope.parentCategory.id
      if $scope.childCategory?
        $scope.classified.child_category = $scope.childCategory.id
      if $scope.location?
        $scope.classified.location = $scope.location.id
      Classified.save $scope.classified, (error, classified) ->
        $location.path "/classified/finish/#{classified.id}"
    # set the attempted variable to true so that CSS can highlight invalid
    # fields
    $scope.attempted = true

  # Function to draw the Map.
  $scope.drawMap = ->
    loaded = false
    initMap = ->
      # These are the default co-ordinates. They center to Kuwait City.
      myLatlng = new google.maps.LatLng 29.375770981110353, 47.98656463623047
      # Initialize the map
      gmap = document.getElementById "maps-container"
      map = new google.maps.Map gmap,
        center: myLatlng
        mapTypeControl: false
        mapTypeId: google.maps.MapTypeId.ROADMAP
        scrollwheel: false
        style: $googleMaps.defaultStyle
        zoom: 13
      # Initialize the marker
      marker = new google.maps.Marker
        draggable: true
        map: map
        position: myLatlng
      # Add the click handler to the map
      google.maps.event.addListener map, 'click', (event) ->
        latLng = new google.maps.LatLng event.latLng.lat(), event.latLng.lng()
        $scope.classified.meta.gmapX = latLng.lat()
        $scope.classified.meta.gmapY = latLng.lng()
        marker.setPosition latLng
        map.panTo latLng
        console.log $scope.meta
      # Add a listener to center the map on the marker whenever th
      # marker has been dragged
      google.maps.event.addListener marker, 'dragend', (event) ->
        latLng = marker.getPosition()
        $scope.classified.meta.gmapX = latLng.lat()
        $scope.classified.meta.gmapY = latLng.lng()
        # Center the map on the position of the marker
        map.panTo latLng
      loaded = true
    # Make sure the map gets rendered only once.
    if not loaded then $googleMaps.onLoad -> initMap()


exports.$inject = [
  "$scope"
  "$googleMaps"
  "$imageResizer"
  "$location"
  "$log"
  "model.classified"
  "model.category"
  "model.location"
]