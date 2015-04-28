module.exports = ($scope, $rootScope, $http) ->
  @name = "[page:landing]"
  console.log @name, "initializing"
  $rootScope.bodyid = "auth-login"

  $scope.processForm = ->
    $http
      method: "POST"
      url: "/api/auth/email/#{ $scope.username }"
      data:
        username: $scope.username
        password: $scope.password
    .success (data) ->
      console.log data
      # if not data.success
      #   # if not successful, bind errors to error variables
      #   $scope.errorName = data.errors.name
      #   $scope.errorSuperhero = data.errors.superheroAlias
      # else
      #   # if successful, bind success message to message
      #   $scope.message = data.message
      #   $scope.errorName = ""
      #   $scope.errorSuperhero = ""

  # login: (username, password, callback) ->
  #   console.debug @name, 'logging in user'

  #   $.ajax
  #     type: 'POST'
  #     url: "/api/auth/email/#{username}"
  #     beforeSend: ajax.setHeaders
  #     data:
  #       username: username
  #       password: password

  #     # This function gets called when the user successfully logs in
  #     success: (response) =>
  #       console.debug @name, 'user logged in', response

  #       # Save the data from the server
  #       @set response
  #       @trigger 'sync', response

  #       # Call the callback
  #       callback null, response

  #     # This function sends the error message to the callback
  #     error: (error) =>
  #       console.error @name, 'error logging in', error
  #       callback error
