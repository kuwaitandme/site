exports = module.exports = ($scope, $stateParams, $rootScope, category) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams


  $scope.parentCategory = category.findBySlug $stateParams.parent
  $scope.childCategory = category.findBySlug $stateParams.child

  $rootScope.extraClass = $rootScope.extraClass or {}

  for cls of $rootScope.extraClass
    if (cls.indexOf "cl-") is 0
      $rootScope.extraClass[cls] = false

  $rootScope.extraClass["cl-#{$stateParams.parent}"] = true


exports.$inject = [
  "$scope"
  "$stateParams"
  "$rootScope"
  "model.category"
]