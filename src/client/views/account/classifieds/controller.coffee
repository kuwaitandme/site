name = "[page:account-manage]"
exports = module.exports = ($location, $log, $scope, Users) ->
  $log.log name, "initializing"
  $scope.$emit "page-loaded", allowBackNavigation: true

  # Prepare options for the classified list.
  $scope.listOptions =
    options:
      emptyMessage: "You have no classifieds"
      finishMessage: "End of classifieds"
      urlTransformer: (classified) -> "/account/classifieds/#{classified.id}"
      showStatus: true
    query: status: owner: Users.getCurrent().get().id or -1


exports.$inject = [
  "$location"
  "$log"
  "$scope"

  "models.users"
]
