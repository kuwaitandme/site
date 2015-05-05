exports = module.exports = ($scope, $location, $http, user) ->
  @name = "[page:auth-signup]"
  console.log @name, "initializing"

  $scope.processForm = =>
    $http
      method: "POST"
      url: "/api/auth/email/signup"
      data:
        fullname:   $scope.fullname
        password:   $scope.password
        repassword: $scope.repassword
        email:      $scope.email

    .success (data, status) =>
      console.log @name, "login successful! redirecting to account page"
      user.setCurrentUser data
      $location.path "/account"

    .error (data, status) ->
      console.error data, status
      # if not data.success
      #   # if not successful, bind errors to error variables
      #   $scope.errorName = data.errors.name
      #   $scope.errorSuperhero = data.errors.superheroAlias
      # else
      #   # if successful, bind success message to message
      #   $scope.message = data.message
      #   $scope.errorName = ""
      #   $scope.errorSuperhero = ""


exports.$inject = [
  "$scope"
  "$location"
  "$http"
  "model.user"
]