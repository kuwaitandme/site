exports = module.exports = ($scope, $stateParams, $googleMaps, console, classified) ->
  @name = "[page:classified-finish]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams


exports.$inject = [
  "$scope"
  "$stateParams"
  "$googleMaps"
  "$log"
  "model.classified"
]