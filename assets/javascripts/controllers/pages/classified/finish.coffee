exports = module.exports = ($scope, $element, $stateParams, $googleMaps, classified) ->
  @name = "[page:classified-finish]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  try $scope.classified = $scope.$parent.$parent.currentClassified
  catch e

  $scope.$on "classified-changed", (event, classified) ->
    $scope.classified = classified

  if not $scope.classified?
    classified.getBySlug $stateParams.slug, (error, result) =>
      $scope.classified = result

      # setTimeout =>
      #   $imgContainer =  angular.element $element[0].querySelector ".gallery"
      #   @masonry = new Masonry $imgContainer[0], itemSelector: "li"
      #   $scope.update = =>
      #     console.log "updating"
      #     @masonry.layout()
      # , 100

  $scope.showClassified = true
  $scope.showContactForm = false
  $scope.drawMap = ->
    X = 29.375770981110353
    Y = 47.98656463623047

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

    $googleMaps.onLoad -> initMap()


exports.$inject = [
  "$scope"
  "$element"
  "$stateParams"
  "$googleMaps"
  "model.classified"
]