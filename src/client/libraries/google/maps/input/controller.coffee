exports = module.exports = ($scope, $element, $googleMaps) ->
  $scope.gmapX ?= 29.375770981110353
  $scope.gmapY ?= 47.98656463623047

  initMap = ->
    # These are the default co-ordinates. They center to Kuwait City.
    myLatlng = new google.maps.LatLng $scope.gmapX, $scope.gmapY

    # Initialize the map
    map = new google.maps.Map $element[0],
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
    google.maps.event.addListener map, "click", (event) ->
      latLng = new google.maps.LatLng event.latLng.lat(), event.latLng.lng()
      $scope.onUpdate latLng.lat(), latLng.lng()
      marker.setPosition latLng
      map.panTo latLng

    # Add a listener to center the map on the marker whenever th
    # marker has been dragged
    google.maps.event.addListener marker, "dragend", (event) ->
      latLng = marker.getPosition()
      $scope.onUpdate latLng.lat(), latLng.lng()
      # Center the map on the position of the marker
      map.panTo latLng


  $googleMaps.onLoad -> initMap()

exports.$inject = [
  "$scope"
  "$element"

  "Google.Maps"
]
