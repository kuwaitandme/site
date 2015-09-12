Controller = ($log, $scope, $window, Notifications, Users) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"

  prompted = false
  $scope.formClasses = {}
  $scope.signup = {}
  $scope.$emit "page:start"

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
  $scope.doSignup = (data={}) ->
    $scope.formClasses = loading: $scope.formLoading = true
    data["gcaptcha"] = $scope.form.gcaptcha

    Users.signup data
    .then (response) -> $scope.page = 2
    .catch (response) ->
      switch response.data
        when "user already registered with email"
          error = "An account is registered with that email. You can
            login with that email."
        else error = "Signup failed. Please check your credentials or try
        again later"

      Notifications.error error, 7000
      logger.error response.data, response.status
    .finally -> $scope.formClasses = loading: $scope.formLoading = false


Controller.tag = "page:auth/signup"
Controller.$inject = [
  "$log"
  "$scope"
  "$window"
  "@notifications"
  "@models/users"
]
module.exports = Controller