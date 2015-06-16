name = "[component:auth]"
scrollPosition = 0
body = (document.getElementsByTagName "body")[0]


exports = module.exports = ($scope, $element, $root, $timeout, $location, $log, $notifications, Users) ->
  $log.log name, "initializing"

  $scope.close = ->
    $element.removeClass "fade"
    $timeout (-> body.scrollTop = scrollPosition ), 200
    $timeout (-> $element.removeClass "show"), 500
    $root.bodyStyles.overflowY = ""

  $scope.open = ->
    $scope.tab = "main"
    $root.bodyStyles.overflowY = "hidden"
    scrollPosition = body.scrollTop
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


  # Function to perform user registration
  $scope.signup = {}
  $scope.doSignup = ->
    console.log $scope.signup
    Users.signup $scope.signup
    .then (response) ->
      $notifications.success "An activation email has been sent, #{response. data.full_name}! (Check your spam folder too)", 10000
      $log.log name, "signup successful! waiting for activation page"
    .catch (response) ->
      $notifications.error "Signup failed. Please check your credentials or try again later"
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
