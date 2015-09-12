exports = module.exports = ($element, $http, $scope, Environment, reCaptcha) ->
  #! Generate a random id to put in place of the captcha's id
  randomId = Math.floor (Math.random() * 1000)
  $scope.id = "gcaptcha-#{randomId}"

  #! This flag is used to display the spinner while checking the server if the
  #! the captcha is required.
  $scope.loaded = false

  #! Use this varaible to keep track of the widget's id.
  widgetId = null

  #! Check the server if captcha is required.
  $http.get "#{Environment.url}/api/security/need_recaptcha"

  #! If it isin't then simply evaluate the captcha as true
  .then -> $scope.onChange true

  #! If it is then the initialize the captcha!
  .catch ->
    #! On the refresh event, reset the captcha!
    $scope.$on "refresh", -> reCaptcha.reset widgetId

    #! Using the modified DOM element (with the random id), finally initialize
    #! the reCaptcha.
    reCaptcha.initialize $scope.id,
      callback: (response) -> $scope.onChange response
      widgetId: (id) -> widgetId = id

  .finally -> $scope.loaded = true


exports.$inject = [
  "$element"
  "$http"
  "$scope"
  "@environment"
  "@google/recaptcha"
]