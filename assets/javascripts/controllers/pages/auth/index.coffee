exports = module.exports = ($scope, $location, $http, console, $notifications, Users) ->
  @name = "[page:auth-login]"
  console.log @name, "initializing"

  # Function to perform user login
  $scope.doLogin = =>
    $http
      method: "POST"
      url: "/api/auth/email/login"
      data:
        password: $scope.password
        username: $scope.username
    .success (data, status) =>
      console.log @name, "login successful! redirecting to account page"
      Users.setCurrentUser data
      $location.path "/account"
    .error (data, status) => console.error @name, data, status

  # Function to perform user registration
  $scope.doSignup = =>
    $http
      method: "POST"
      url: "/api/auth/email/signup"
      data:
        email:      $scope.email
        fullname:   $scope.fullname
        password:   $scope.password
        repassword: $scope.repassword
    .success (data, status) =>
      console.log @name, "login successful! redirecting to account page"
      Users.setCurrentUser data
      $location.path "/account"
    .error (data, status) => console.error @name, data, status


exports.$inject = [
  "$scope"
  "$location"
  "$http"
  "$log"
  "$notifications"

  "model.users"
]