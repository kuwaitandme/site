exports = module.exports = ($scope, $stateParams, $googleMaps, console, Classifieds) ->
  @name = "[page:classified-finish]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.heroURL = "landing.jpg"
  Classifieds.get $stateParams.id, (error, classified) =>
    $scope.classified = classified
    $scope.$emit "page-loaded"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$googleMaps"
  "$log"

  "model.classifieds"
]