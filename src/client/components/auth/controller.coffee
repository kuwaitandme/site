exports = module.exports = ($scope, $element, $timeout, $location, $log, $notifications, Users) ->
  @name = "[component:auth]"
  $log.log @name, "initializing"

  $scope.close = ->
    $element.removeClass "fade"
    $timeout (-> $element.removeClass "show"), 500

  $scope.open = ->
    $element.addClass "show"
    $timeout (-> $element.addClass "fade"), 100

  $scope.goto = (name) -> $scope.tab = name

  $scope.login = {}
  $scope.doLogin = =>
    Users.login $scope.login
    .then (response) =>
      if response.status is 200
        $location.path "/account"
        $location.search "_success", "login_success"
      else
        $notifications.error "Invalid login. Please check your credentials"
        $log.error @name, response.data, response.status

exports.$inject = [
  "$scope"
  "$element"
  "$timeout"
  "$location"
  "$log"
  "$notifications"

  "models.users"
]
