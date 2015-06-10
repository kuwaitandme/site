exports = module.exports = ($element, $log, $scope, $timeout, Classifieds,
$maps) ->
  @name = "[component:classified-single]"
  $log.log @name, "initializing"

  cl = $scope.classified or Classifieds.getDefault()
  cl.show = true
  # Initialize masonry
  $scope.$watch $scope.classified, -> $timeout ->
    imageContainer = $element[0].querySelector "ul.gallery"
    cl.masonry = new Masonry imageContainer, gutter: 0, transitionDuration: 0
  , 10

  # Reload masonry on the refresh event
  $scope.$on "refresh", -> if cl.masonry? then $timeout (-> cl.masonry.layout())

  # When images are loaded, re-layout masonry
  $scope.update = -> if cl.masonry? then cl.masonry.layout()

  # This function is used to render the Google maps component if needed.
  $scope.drawMap = ->
    initMap = ->
      # Get the maps container and erase any previously initialized map.
      gmap = $element[0].querySelector "#maps-container"
      gmap.innerHTML = ""
      ############# FIX for cards
      # The co-ordinates to which we will center the map
      latLng = new google.maps.LatLng cl.meta.gmapX, cl.meta.gmapY
      # Initialize the map
      map = new google.maps.Map gmap,
        center: latLng
        mapTypeControl: false
        style: $maps.defaultStyle
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
    $maps.onLoad -> initMap()


exports.$inject = [
  "$element"
  "$log"
  "$scope"
  "$timeout"

  "models.classifieds"

  "Google.maps"
]
