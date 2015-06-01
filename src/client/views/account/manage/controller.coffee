exports = module.exports = ($scope, console, Users) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"
  $scope.$emit "page-loaded"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  if Users.getCurrentUser().role in [1, 2] then $scope.query = status: 0
  else $scope.query = owner: Users.getCurrentUser().id or -1
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "You have no classifieds"
  $scope.redirectToEditPage = true
  $scope.showStatus = true

exports.$inject = [
  "$scope"
  "$log"

  "models.users"
]