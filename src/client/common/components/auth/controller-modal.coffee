name = "[component:auth-modal]"


exports = module.exports = ($scope, $element, $root, $timeout, $location, $log,
$notifications, Users, close) ->
  $log.log name, "initializing"

  $scope.tab = "main"
  $scope.goto = (name) -> $scope.tab = name

  # Login button handler
  $scope.login = {}
  $scope.doLogin = ->
    Users.login $scope.login
    .then (response) ->
      if $location.path() is "/" then $location.path "/account"
      $location.search "_success", "login_success"
      close()

    .catch (response) ->
      $notifications.error "Invalid login. Please check your credentials"
      $log.error name, response.data, response.status


  # Function to perform user registration
  $scope.signup = {}
  $scope.doSignup = ->
    Users.signup $scope.signup
    .then (response) ->
      $log.log name, "signup successful! waiting for activation page"
      $notifications.success "An activation email has been sent,
        #{response.data.full_name}! (Check your spam folder too)", 10000
      close()

    .catch (response) ->
      switch response.data
        when "user already registered with email"
          error = "An account is registered with that email. You can
            login with that email."
        else error = "Signup failed. Please check your credentials or try
        again later"

      $notifications.error error, 7000
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
  "close"
]
