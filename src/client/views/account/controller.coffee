exports = module.exports = ($element, $location, $log, $notifications, $scope,
$timeout, Languages, Users) ->
  @name = "[page:account]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"
  currentUser = Users.getCurrent() or {}


  query = $location.search()
  if query._success?
    currentUserName = currentUser.full_name or ""
    string = Languages.translate query._success
    $notifications.success string.replace "_NAME_", currentUserName
    $location.search "_success", null

  if currentUser.role in [Users.roles.MODERATOR, Users.roles.ADMIN]
    $scope.isModerator = true

  container = $element[0].querySelector ".row"
  $timeout (-> masonry = new Masonry container, transitionDuration: 0), 10


exports.$inject = [
  "$element"
  "$location"
  "$log"
  "$notifications"
  "$scope"
  "$timeout"

  "models.languages"
  "models.users"
]
