exports = module.exports = ($location, $log, $scope, Users) ->
  @name = "[page:account-manage]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"

  # Prepare the query for the classified.list controller. This object
  # gets inherited by the classified.list controller.
  $scope.query = owner: Users.getCurrent().get().id or -1
  $scope.finishMessage = "End of classifieds"
  $scope.emptyMessage = "You have no classifieds"
  $scope.showStatus = true

  $scope.$on "classified-list:click", ($event, data) ->
    $location.path "/account/classifieds/#{data.classified.id}"


exports.$inject = [
  "$location"
  "$log"
  "$scope"

  "models.users"
]
