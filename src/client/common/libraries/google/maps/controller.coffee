exports = module.exports = ($scope, $element, $googleMaps) ->
  initMap = ->
    if not $scope.gmapX or not $scope.gmapY then return

    # Get the maps container and erase any previously initialized map.
    gmap = $element[0]
    gmap.innerHTML = ""

    # The co-ordinates to which we will center the map
    myLatlng = new google.maps.LatLng $scope.gmapX, $scope.gmapY

    # Initialize the map
    map = new google.maps.Map gmap,
      center: myLatlng
      draggable: false
      mapTypeControl: false
      mapTypeId: google.maps.MapTypeId.ROADMAP
      panControl: false
      scrollwheel: false
      streetViewControl: false
      style: $googleMaps.defaultStyle
      zoom: 13
      zoomControl: false

    # Initialize the marker
    marker = new google.maps.Marker
      draggable: false
      map: map
      position: myLatlng


  render = -> $googleMaps.onLoad -> initMap()
  $scope.$watch "gmapX", render
  $scope.$on "refresh", render


exports.$inject = [
  "$scope"
  "$element"

  "Google.Maps"
]
