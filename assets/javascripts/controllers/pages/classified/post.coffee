exports = module.exports = ($scope, $element, $googleMaps, $imageResizer,
classified, category, location) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "classified-post"

  $scope.classified = {}
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
  $scope.$watch "title", titleChange


  # Function to listen for changes with classified description
  descriptionChange = (newValue="") ->
    minDescription = 50
    maxDescription = 2000
    if minDescription <= newValue.length <= maxDescription
      remaining = maxDescription - newValue.length
      $scope.remainingDescription = "#{remaining} characters left"
    else $scope.remainingDescription = ""
  $scope.$watch "description", descriptionChange


  $scope.addImages = ->
    $el = angular.element document.querySelectorAll "[type='file']"
    $el[0].click()


  $scope.fileChange = (files) ->
    console.log files
    console.log $imageResizer
    $scope.files = [] if not $scope.files?

    for file in files
      $imageResizer.createThumbnail file,
        thumbnailWidth: 300
        thumbnailHeight: 300
        callback: (dataURL) =>
          $scope.$apply -> $scope.files.push file: dataURL
      # $scope.$apply()


  $scope.validate = -> # _validateTitle()
  $scope.validate()


  $scope.drawMap = ->
    X = 29.375770981110353
    Y = 47.98656463623047
    loaded = false

    initMap = ->
      # The default co-ordinates to which we will center the map
      myLatlng = new google.maps.LatLng X, Y

      # Initialize the map
      gmap = document.getElementById "maps-container"
      map = new google.maps.Map gmap,
        center: myLatlng
        mapTypeControl: false
        style: $googleMaps.defaultStyle
        mapTypeId: google.maps.MapTypeId.ROADMAP
        scrollwheel: false
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
  "model.classified"
  "model.category"
  "model.location"
]