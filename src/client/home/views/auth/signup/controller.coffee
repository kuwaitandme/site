name = "[page:auth/signup]"


exports = module.exports = ($http, $location, $log, $notifications, $scope,
$timeout, Languages, Users, $window) ->
  $log.log name, "initializing"

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

  usernameLock = false
  $scope.$watch "signup.username", (value) ->
    # TODO: Poll the server to see if username is valid
    $scope.usernameValid = value?


  # Function to perform user registration
  $scope.signup = {}
  $scope.doSignup = (data) ->
    $scope.formClasses = loading: $scope.formLoading = true
    Users.signup data
    .then (response) -> $scope.page = 3
    .catch (response) ->
      switch response.data
        when "user already registered with email"
          error = "An account is registered with that email. You can
            login with that email."
        else error = "Signup failed. Please check your credentials or try
        again later"

      $notifications.error error, 7000
      $log.error name, response.data, response.status
    .finally -> $scope.formClasses = loading: $scope.formLoading = false



  $window.onbeforeunload = ->
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
