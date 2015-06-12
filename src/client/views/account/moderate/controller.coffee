exports = module.exports = ($scope, $location, $log, Classifieds) ->
  @name = "[page:account-manage]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = status: Classifieds.statuses.INACTIVE
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "No classifieds to moderate"

  $scope.$on "classified-list:click", ($event, data) ->
    $location.path "/account/moderate/#{data.classified.id}"


exports.$inject = [
  "$scope"
  "$location"
  "$log"

  "models.classifieds"
]