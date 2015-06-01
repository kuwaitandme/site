exports = module.exports = ($location, $log, $scope, $notifications, Languages,
Users) ->
  @name = "[page:account]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"

  query = $location.search()
  if query._success?
    currentUser = Users.getCurrentUser() or {}
    currentUserName = currentUser.full_name or ""
    string = Languages.translate query._success
    $notifications.success string.replace "_NAME_", currentUserName


exports.$inject = [
  "$location"
  "$log"
  "$scope"
  "$notifications"

  "models.languages"
  "models.users"
]
