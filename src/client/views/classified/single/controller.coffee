exports = module.exports = ($scope, $root, $stateParams, $log, Classifieds) ->
  @name = "[page:classified-single]"
  $log.log @name, "initializing"
  $log.debug @name, "routeParams", $stateParams

  $root.bodyStyles['stick-header'] = true

  $scope.$on "classified-changed", (event, classified) ->
    $scope.classified = classified

  if not $scope.classified?
    Classifieds.getBySlug $stateParams.slug, (error, classified) =>
      $scope.classified = classified
      $scope.$emit "page-loaded"
      # $root.meta.robotsNoIndex = classified.meta.hideSearchEngine


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.classifieds"
]
