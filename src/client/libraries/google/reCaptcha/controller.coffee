exports = module.exports = ($scope, $element, reCaptcha) ->

  # Generate a random id to put in place of the captcha's id
  randomId    = Math.floor (Math.random() * 1000)
  captchaId = "gcaptcha-#{randomId}"
  $element[0].id = captchaId
  widgetId = null

  $scope.$on "refresh", -> reCaptcha.reset widgetId

  # Using the modified DOM element (with the random id), initialize the
  # reCaptcha.
  reCaptcha.initialize captchaId,
    widgetId: (id) -> widgetId = id
    callback: (response) -> $scope.onChange response


exports.$inject = [
  "$scope"
  "$element"

  "Google.reCaptcha"
]
