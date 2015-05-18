exports = module.exports = ($location, $log, $scope, $notifications, Languages,
Users) ->
  @name = "[page:account-index]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"

  query = $location.search()
  if query._success?
    currentUser = Users.getCurrentUser() or {}
    currentUserName = currentUser.full_name or ""
    string.replace "_NAME_", currentUserName
    $notifications.success _translate Languages.translate query._success


exports.$inject = [
  "$location"
  "$log"
  "$scope"
  "$notifications"

  "model.languages"
  "model.users"
]