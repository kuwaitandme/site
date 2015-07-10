name = "[page:classified-single]"


exports = module.exports = ($scope, $root, $stateParams, $log, Classifieds) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  # $root.bodyStyles['stick-header'] = true

  Classifieds.get $stateParams.id
  .then (classified) ->
    $scope.classified = classified
    $scope.$emit "page-loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
