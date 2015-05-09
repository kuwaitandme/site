exports = module.exports = ($scope, $stateParams, $rootScope, console, category) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.query =
    parent_category: category.findBySlug $stateParams.parent
    child_category: category.findBySlug $stateParams.child

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