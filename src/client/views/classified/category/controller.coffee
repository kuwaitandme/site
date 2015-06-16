exports = module.exports = ($scope, $stateParams, $log, Categories) ->
  @name = "[page:classified-search]"
  $log.log @name, "initializing"
  $log.debug @name, "routeParams", $stateParams

  $scope.childCategory  = Categories.findBySlug $stateParams.child
  $scope.parentCategory = Categories.findBySlug $stateParams.parent
  $scope.$emit "page-loaded"

exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"

  "models.categories"
]
