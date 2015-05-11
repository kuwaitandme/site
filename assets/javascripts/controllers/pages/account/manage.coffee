exports = module.exports = ($scope, console, User) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = owner: User.getCurrentUser().id
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "You have no classifieds"
  # $scope.

exports.$inject = [
  "$scope"
  "$log"
  "model.user"
]