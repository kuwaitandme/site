exports = module.exports = ($scope, $googleMaps, console, Classifieds) ->
  @name = "[component:classified-single]"
  console.log @name, "initializing"
  console.debug @name, $scope

  cl = $scope.classified or Classifieds.getDefault()
  cl.show = true

  # This function is used to render the Google maps component if needed.
  $scope.drawMap = ->
    initMap = ->
      # The co-ordinates to which we will center the map
      latLng = new google.maps.LatLng cl.meta.gmapX, cl.meta.gmapY
      # Initialize the map
      gmap = document.getElementById "maps-container"
      map = new google.maps.Map gmap,
        center: latLng
        mapTypeControl: false
        style: $googleMaps.defaultStyle
        mapTypeId: google.maps.MapTypeId.ROADMAP
        scrollwheel: false
        panControl: false
        zoomControl: false
        streetViewControl: false
        draggable: false
        zoom: 13
      # Initialize the marker
      marker = new google.maps.Marker
        draggable: false
        map: map
        position: latLng
    # When googlemaps loads, then render the map
    $googleMaps.onLoad -> initMap()


exports.$inject = [
  "$scope"
  "$googleMaps"
  "$log"

  "model.classified"
]