name = "[page:classified-finish]"
exports = module.exports = ($scope, $stateParams, $log, Classifieds) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  Classifieds.get $stateParams.id
  .then (classified) ->
    $scope.classified = classified
    $scope.$emit "page-loaded"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
