exports = module.exports = ($scope, $stateParams, $rootScope, $log, $location
Categories, Classifieds) ->
  @name = "[page:classified-search]"
  $log.log @name, "initializing"
  $log.debug @name, "routeParams", $stateParams

  $scope.childCategory  = Categories.findBySlug($stateParams.child) or {}
  $scope.parentCategory = Categories.findBySlug($stateParams.parent) or {}

  $scope.heroURL = "cl-#{$scope.parentCategory.slug or 'miscellaneous'}.jpg"
  $scope.onHeroLoad = ->
  $scope.$emit "page-loaded"

  $scope.query = {}
  angular.extend(
    $scope.query
    $location.search()
    {
      child_category:  $scope.childCategory.id
      parent_category: $scope.parentCategory.id
      status:          Classifieds.statuses.ACTIVE
    }
  )

  for cls of $rootScope.bodyClasses then if (cls.indexOf "cl-") is 0
    $rootScope.bodyClasses[cls] = false
  $rootScope.bodyClasses["cl-#{$stateParams.parent}"] = true


exports.$inject = [
  "$scope"
  "$stateParams"
  "$rootScope"
  "$log"
  "$location"

  "models.categories"
  "models.classifieds"
]
