exports = module.exports = ($scope, console, Users) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"
  $scope.$emit "page-loaded"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = owner: Users.getCurrentUser().id or -1
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "You have no classifieds"
  $scope.redirectToEditPage = true
  $scope.showStatus = true

exports.$inject = [
  "$scope"
  "$log"

  "model.users"
]