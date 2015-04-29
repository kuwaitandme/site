exports = module.exports = ($scope, $location, $http, user) ->
  @name = "[page:auth-login]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "auth-login"

  $scope.processForm = =>
    $http
      method: "POST"
      url: "/api/auth/email/#{ $scope.username }"
      data:
        username: $scope.username
        password: $scope.password

    .success (data, status) =>
      console.log @name, 'login successful! redirecting to account page'
      user.setCurrentUser data
      $location.path '/account'

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
  '$scope'
  '$location'
  '$http'
  'model.user'
]