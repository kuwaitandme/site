exports = module.exports = ($http, $location, $log, $notifications, $scope,
$timeout, Languages, Users, $window) ->
  @name = "[page:auth-login]"
  $log.log @name, "initializing"
  prompted = false
  $scope.formClasses = {}
  $scope.login = {}
  $scope.$emit "page:loaded"

  $scope.goto = (i) ->
    $scope.page = i
    promted = false

  $scope.$watch "login.email", (value) ->
    # TODO: Poll the server to see if email is valid
    $scope.emailValid = value?

  $scope.$watch "login.username", (value) ->
    # TODO: Poll the server to see if username is valid
    $scope.usernameValid = value?


  $scope.doLogin = (data) ->
    $scope.formClasses = loading: $scope.formLoading = true

    Users.login $scope.login
    .then (response) ->
      $location.path "/account"
      $notifications.success "Login success!"
    .catch (response) ->
      $notifications.error "Invalid login. Please check your credentials"
      $log.error name, response.data, response.status
    .finally -> $scope.formClasses = loading: $scope.formLoading = false



  # $window.onbeforeunload = ->
  #   console.log $scope.page is 2 and not promted
  #   if $scope.page is 2 and not promted
  #     promted = true
  #     return "Are you sure you want to leave? You haven't signed up yet."


exports.$inject = [
  "$http"
  "$location"
  "$log"
  "$notifications"
  "$scope"
  "$timeout"

  "models.languages"
  "models.users"
  "$window"
]
