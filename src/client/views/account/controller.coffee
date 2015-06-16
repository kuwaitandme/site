exports = module.exports = ($element, $location, $log, $scope,
$timeout, Users) ->
  @name = "[page:account]"
  $log.log @name, "initializing"
  $scope.$emit "page-loaded"
  currentUser = Users.getCurrent() or {}


  if currentUser.isModerator() or currentUser.isAdmin()
    $scope.isModerator = true

  container = $element[0].querySelector ".row"
  $timeout (-> masonry = new Masonry container, transitionDuration: 0), 10


exports.$inject = [
  "$element"
  "$location"
  "$log"
  "$scope"
  "$timeout"

  "models.users"
]
