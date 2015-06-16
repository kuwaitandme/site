exports = module.exports = ($scope, $stateParams, $rootScope, console,
Categories, Classifieds) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.childCategory  = Categories.findBySlug $stateParams.child
  $scope.parentCategory = Categories.findBySlug $stateParams.parent

  # $scope.heroURL = "cl-#{$scope.parentCategory.slug or 'miscellaneous'}.jpg"
  $scope.$emit "page-loaded"

  $scope.displayClassifiedList = true
  $scope.onHeroLoad = ->

  $scope.query =
    child_category:  $scope.childCategory.id
    parent_category: $scope.parentCategory.id
    status:          Classifieds.statuses.ACTIVE

  # $rootScope.bodyClasses ?= {}
  for cls of $rootScope.bodyClasses then if (cls.indexOf "cl-") is 0
    $rootScope.bodyClasses[cls] = false
  $rootScope.bodyClasses["cl-#{$stateParams.parent}"] = true


exports.$inject = [
  "$scope"
  "$stateParams"
  "$rootScope"
  "$log"

  "models.categories"
  "models.classifieds"
]
