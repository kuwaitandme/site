name = "[page:classified-single]"


exports = module.exports = ($scope, $root, $stateParams, $log, Classifieds) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  $scope.$emit "page-loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
