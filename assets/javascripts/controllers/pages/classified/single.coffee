exports = module.exports = ($scope, $element, $stateParams, Classified) ->
  @name = "[page:classified-single]"
  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  $scope.$on "classified-changed", (event, classified) ->
    $scope.classified = classified

  if not $scope.classified?
    Classified.getBySlug $stateParams.slug, (error, classified) =>
      $scope.classified = classified

exports.$inject = [
  "$scope"
  "$element"
  "$stateParams"
  "model.classified"
]