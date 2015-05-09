exports = module.exports = ($scope, $googleMaps, console, Classified) ->
  @name = "[component:classified-single]"
  console.log @name, "initializing"
  console.debug @name, $scope

  console.log $scope.classified
  cl = $scope.classified or {}
  cl.meta = cl.meta or {}
  cl.show = true
  cl.showContactForm = false

  switch cl.status
    when Classified.statuses.ACTIVE then cl.isActive = true
    when Classified.statuses.ARCHIVED then cl.isArchived = true
    when Classified.statuses.REJECTED then cl.isRejected = true
    when Classified.statuses.BANNED then cl.isBanned = true
    when Classified.statuses.INACTIVE then cl.underReview = true
    when Classified.statuses.EXPIRED then cl.hasExpired = true

  if cl.meta.deliveryIncluded
    if not cl.meta.freeDeliveryIncluded then cl.hasDelivery = true
    else cl.hasFreeDelivery = true

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
        zoom: 13
      # Initialize the marker
      marker = new google.maps.Marker
        draggable: true
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