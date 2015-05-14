## TODO: Add automatic resize of content
exports = module.exports = ($scope, $googleMaps, $imageResizer,
  $location, $notifications, console, Classifieds, Categories, Locations) ->
  @name = "[component:classified-form]"
  console.log @name, "initializing"

  $scope.categories = Categories.getAll()
  $scope.locations = Locations.getAll()
  $scope.onSuccess ?= ->

  # If classified is not defined, then set it to it's default values. By scope
  # inheritance if there was a classified in the parent controller, it should
  # override this line.
  $scope.classified ?= Classifieds.getDefault()

  $scope.classified.parentCategory = Categories.findByParentId $scope.classified.parent_category or null
  $scope.classified.childCategory = Categories.findByChildId $scope.classified.child_category or null
  $scope.location = Locations.findById $scope.classified.location

  $scope.superEditable = true

  # Function to listen for changes with classified title
  onTitleChange = (newValue="") ->
    minTitle = 20
    maxTitle = 140
    if minTitle <= newValue.length <= maxTitle
      remaining = maxTitle - newValue.length
      $scope.remainingTitle = "#{remaining} characters left"
    else $scope.remainingTitle = ""
  $scope.$watch "classified.title", onTitleChange


  # Function to listen for changes with classified description
  onDescriptionChange = (newValue="") ->
    minDescription = 50
    maxDescription = 2000
    if minDescription <= newValue.length <= maxDescription
      remaining = maxDescription - newValue.length
      $scope.remainingDescription = "#{remaining} characters left"
    else $scope.remainingDescription = ""
  $scope.$watch "classified.description", onDescriptionChange


  # Function to popup the file selector dialog
  $scope.addImages = ->
    $el = angular.element document.querySelectorAll "[type='file']"
    $el[0].click()


  $scope.changeStatus = (newStatus) =>
    console.debug @name, "changing status to : '#{newStatus}'"
    $scope.classified.status = Classifieds.statuses[newStatus]
    $scope.submit()


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
            filename: file.name
            width: file.width
            height: file.height
            src: dataURL
            main: not isThereMainImage
            status: "to-upload"
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
  $scope.submit = =>
    # Only perform the submit function if the form has validated properly
    if not $scope.form.$invalid
      console.log @name, "submitting form"

      for image in ($scope.classified.images or []) then delete image.src

      if $scope.classified.parentCategory?
        $scope.classified.parent_category = $scope.classified.parentCategory.id
      if $scope.classified.childCategory?
        $scope.classified.child_category = $scope.classified.childCategory.id
      if $scope.location?
        $scope.classified.location = $scope.location.id
      Classifieds.save $scope.classified, (error, classified) ->
        if error
          return $notifications.error "Something went wrong while saving your classified. Try again later"

        $scope.onSuccess classified
    else
      $notifications.error "You have some invalid fields in your form. Have a look at them again"
    # set the attempted variable to true so that CSS can highlight invalid
    # fields
    $scope.attempted = true


  # Function to draw the Map.
  $scope.drawMap = ->
    loaded = false
    initMap = ->
      # These are the default co-ordinates. They center to Kuwait City.
      myLatlng = new google.maps.LatLng(
        $scope.classified.meta.gmapX or 29.375770981110353,
        $scope.classified.meta.gmapY or 47.98656463623047
      )
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
  "$notifications"
  "$log"

  "model.classifieds"
  "model.categories"
  "model.locations"
]