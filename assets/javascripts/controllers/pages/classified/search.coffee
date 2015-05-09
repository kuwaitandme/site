exports = module.exports = ($scope, $stateParams, $rootScope, console, category) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.childCategory = category.findBySlug $stateParams.child
  $scope.parentCategory = category.findBySlug $stateParams.parent

  $scope.query =
    child_category:  $scope.childCategory
    parent_category: $scope.parentCategory

  $rootScope.bodyClasses = $rootScope.bodyClasses or {}
  for cls of $rootScope.bodyClasses then if (cls.indexOf "cl-") is 0
    $rootScope.bodyClasses[cls] = false
  $rootScope.bodyClasses["cl-#{$stateParams.parent}"] = true


exports.$inject = [
  "$scope"
  "$stateParams"
  "$rootScope"
  "$log"
  "model.category"
]