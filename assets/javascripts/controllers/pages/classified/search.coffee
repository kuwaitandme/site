exports = module.exports = ($scope, $stateParams, $rootScope, $storage, category) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.parentCategory = category.findBySlug $stateParams.parent
  $scope.childCategory = category.findBySlug $stateParams.child

  $rootScope.bodyClasses = $rootScope.bodyClasses or {}
  for cls of $rootScope.bodyClasses then if (cls.indexOf "cl-") is 0
    $rootScope.bodyClasses[cls] = false
  $rootScope.bodyClasses["cl-#{$stateParams.parent}"] = true


exports.$inject = [
  "$scope"
  "$stateParams"
  "$rootScope"
  "$storage"
  "model.category"
]