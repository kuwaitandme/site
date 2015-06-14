exports = module.exports = ($http, $location, $log, $notifications, $scope,
Languages, Users) ->
  @name = "[page:auth-login]"
  $log.log @name, "initializing"

  query = $location.search()
  if query._success?
    $notifications.success Languages.translate query._success
    $location.search "_success", null
  if query._error?
    $notifications.error Languages.translate query._error
    $location.search "_error", null

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
      $log.log @name, "login successful! redirecting to account page"
      Users.setCurrentUser data
      $location.path "/account"
      $location.search "_success", "login_success"

    .error (data, status) =>
      $notifications.error "Invalid login. Please check your credentials"
      $log.error @name, data, status

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
