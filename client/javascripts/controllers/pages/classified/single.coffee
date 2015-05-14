exports = module.exports = ($scope, $root, $stateParams, console, Classifieds) ->
  @name = "[page:classified-single]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams


  $scope.$on "classified-changed", (event, classified) ->
    $scope.classified = classified

  if not $scope.classified?
    Classifieds.getBySlug $stateParams.slug, (error, classified) =>
      $scope.classified = classified
      $scope.$emit "page-loaded"
      $root.meta.robotsNoIndex = classified.meta.hideSearchEngine


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "model.classifieds"
]