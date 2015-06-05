exports = module.exports = ($scope, console, Classifieds) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"
  $scope.$emit "page-loaded"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = status: Classifieds.statuses.INACTIVE
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "No classifieds to moderate"
  $scope.redirectToEditPage = true
  $scope.showStatus = true

exports.$inject = [
  "$scope"
  "$log"

  "models.classifieds"
]
