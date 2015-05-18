exports = module.exports = ($http, $location, console, $notifications, $scope, Users) ->
  @name = "[page:auth-login]"
  console.log @name, "initializing"
  $scope.$emit "page-loaded"

  $scope.login = {}
  $scope.signup = {}
  # Function to perform user login
  $scope.doLogin = =>
    $http
      data: $scope.login
      method: "POST"
      url: "/api/auth/email/login"
    .success (data, status) =>
      console.log @name, "login successful! redirecting to account page"
      Users.setCurrentUser data
      $notifications.success "Welcome #{data.full_name}, You have been logged in!"
      $location.path "/account"
    .error (data, status) =>
      $notifications.error "Invalid login. Please check your credentials"
      console.error @name, data, status

  # Function to perform user registration
  $scope.doSignup = =>
    $http
      data: $scope.signup
      method: "POST"
      url: "/api/auth/email/signup"
    .success (data, status) =>
      $notifications.success "An activation email has been sent, #{data.full_name}! (Check your spam folder too)"
      console.log @name, "signup successful! waiting for activation page"
    .error (data, status) =>
      console.error @name, data, status
      $notifications.error "Signup failed. Please check your credentials or try again later"


exports.$inject = [
  "$http"
  "$location"
  "$log"
  "$notifications"
  "$scope"

  "model.users"
]