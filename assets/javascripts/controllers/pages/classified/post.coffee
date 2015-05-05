## TODO: Add automatic resize of content

exports = module.exports = ($scope, $element, $googleMaps, $imageResizer,
  $location, classified, category, location) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"

  # If classified is not defined, then set it to it's default values
  if not $scope.classified? then $scope.classified = classified.getDefault()

  $scope.categories = category.getAll()
  $scope.locations = location.getAll()

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
      $imageResizer.createThumbnail file,
        thumbnailWidth: 300
        thumbnailHeight: 300
        callback: (dataURL) => $scope.$apply -> $scope.classified.images.push
          id: Math.random() * 100000
          file: dataURL
          status: "to-upload"


  # Handler function to remove the file from the Uploads queue
  $scope.removeFile = ($event) ->
    $li = angular.element $event.target.parentNode
    status = $li.data().$scope.classified.images.status

    if status is "on-server"
      $li.data().$scope.classified.images.status = "to-delete-from-server"
    else $li.data().$scope.classified.images.status = "to-delete"


  $scope.submit = ->
    if not $scope.form.$invalid
      classified.save $scope.classified, (error, classified) ->
        $location.path "/#{classified.slug}/finish"
    $scope.attempted = true


  # Function to draw the Google Map if needed.
  $scope.drawMap = ->
    # These are the default co-ordinates. They center to Kuwait City.
    X = 29.375770981110353
    Y = 47.98656463623047
    loaded = false

    initMap = ->
      myLatlng = new google.maps.LatLng X, Y

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

      google.maps.event.addListener map, 'click', (event) ->
        latitude = event.latLng.lat()
        longitude = event.latLng.lng()

        latLng = new google.maps.LatLng latitude, longitude
        $scope.meta.gmapX = latLng.lat()
        $scope.meta.gmapY = latLng.lng()

        marker.setPosition latLng
        map.panTo latLng

      # Add a listener to center the map on the marker whenever th
      # marker has been dragged
      google.maps.event.addListener marker, 'dragend', (event) ->
        latLng = marker.getPosition()
        $scope.meta.gmapX = latLng.lat()
        $scope.meta.gmapY = latLng.lng()

        # Center the map on the position of the marker
        map.panTo latLng

      loaded = true
    if not loaded then $googleMaps.onLoad -> initMap()


exports.$inject = [
  "$scope"
  "$element"
  "$googleMaps"
  "$imageResizer"
  "$location"
  "model.classified"
  "model.category"
  "model.location"
]