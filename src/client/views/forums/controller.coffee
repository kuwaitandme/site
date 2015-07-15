name = "[page:classified-single]"


exports = module.exports = ($scope, $root, $stateParams, $log, Categories) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  $scope.categories = Categories.getAll()
  $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.forums.categories"
]
