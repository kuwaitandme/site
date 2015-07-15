exports = module.exports = ($http, $location, $log, $notifications, $scope,
Languages, Users) ->
  @name = "[page:auth-login]"
  $log.log @name, "initializing"


  $scope.$emit "page:loaded"


  $scope.login = {}
  $scope.signup = {}
  # Function to perform user login


  # Function to perform user registration
  $scope.doSignup = =>
    $http
      data: $scope.signup
      method: "POST"
      url: "/api/auth/email/signup"
    .success (data, status) =>
      $notifications.success "An activation email has been sent, #{data.full_name}! (Check your spam folder too)"
      $log.log @name, "signup successful! waiting for activation page"
    .error (data, status) =>
      $log.error @name, data, status
      $notifications.error "Signup failed. Please check your credentials or try again later"


exports.$inject = [
  "$http"
  "$location"
  "$log"
  "$notifications"
  "$scope"

  "models.languages"
  "models.users"
]
