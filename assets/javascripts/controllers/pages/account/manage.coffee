exports = module.exports = ($scope, console, Users) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = owner: Users.getCurrentUser().id
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "You have no classifieds"
  $scope.redirectToEditPage = true

exports.$inject = [
  "$scope"
  "$log"

  "model.users"
]