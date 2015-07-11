name = "[page:account-moderate]"
exports = module.exports = ($scope, $location, $log, Classifieds) ->
  $log.log name, "initializing"
  $scope.$emit "page-loaded", allowBackNavigation: true

  # Prepare options for the classified list.
  $scope.listOptions =
    options:
      emptyMessage: "No classifieds to moderate"
      finishMessage: "End of classifieds"
      urlTransformer: (classified) -> "/account/moderate/#{classified.id}"
    query: status: Classifieds.statuses.INACTIVE


exports.$inject = [
  "$scope"
  "$location"
  "$log"

  "models.classifieds"
]
