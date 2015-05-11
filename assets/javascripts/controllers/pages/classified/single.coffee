exports = module.exports = ($scope, $stateParams, console, Classifieds) ->
  @name = "[page:classified-single]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.$on "classified-changed", (event, classified) ->
    $scope.classified = classified

  if not $scope.classified?
    Classifieds.getBySlug $stateParams.slug, (error, classified) =>
      $scope.classified = classified

exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"

  "model.classifieds"
]