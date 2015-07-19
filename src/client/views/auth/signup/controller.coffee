exports = module.exports = ($http, $location, $log, $notifications, $scope,
$timeout, Languages, Users, $window) ->
  @name = "[page:auth-signup]"
  $log.log @name, "initializing"
  prompted = false
  $scope.formClasses = {}
  $scope.signup = {}
  $scope.$emit "page:loaded"

  $scope.goto = (i) ->
    $scope.page = i
    promted = false

  $scope.$watch "signup.email", (value) ->
    # TODO: Poll the server to see if email is valid
    $scope.emailValid = value?

  $scope.$watch "signup.username", (value) ->
    # TODO: Poll the server to see if username is valid
    $scope.usernameValid = value?


  $scope.doSignup = (data) ->
    $scope.formClasses = loading: true
    $scope.formLoading = true
    $timeout (-> $scope.page = 3), 1000



  $window.onbeforeunload = ->
    console.log $scope.page is 2 and not promted
    if $scope.page is 2 and not promted
      promted = true
      return "Are you sure you want to leave? You haven't signed up yet."


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
