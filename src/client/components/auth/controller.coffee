name = "[component:auth]"
exports = module.exports = ($scope, $element, $root, $timeout, $location, $log, $notifications, Users) ->
  $log.log name, "initializing"

  $scope.close = ->
    $element.removeClass "fade"
    $timeout (-> $element.removeClass "show"), 500

  $scope.open = ->
    $scope.tab = "main"
    $element.addClass "show"
    $timeout (-> $element.addClass "fade"), 100

  $scope.goto = (name) -> $scope.tab = name

  $scope.$on "show:auth-modal", -> $scope.open()

  $scope.login = {}
  $scope.doLogin = ->
    Users.login $scope.login
    .then (response) ->
      $scope.close()
      $root.$broadcast "refresh"
      $scope.$on "show:auth-modal", -> $scope.open()
      $location.path "/account"
      $location.search "_success", "login_success"
    .catch (response) ->
      $notifications.error "Invalid login. Please check your credentials"
      $log.error name, response.data, response.status


exports.$inject = [
  "$scope"
  "$element"
  "$rootScope"
  "$timeout"
  "$location"
  "$log"
  "$notifications"

  "models.users"
]
