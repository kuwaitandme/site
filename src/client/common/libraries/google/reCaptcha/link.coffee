module.exports = (scope, element, attributes, ngModel) ->

  # Really this function is all that is needed here. This function gets the
  # response from the reCaptcha API and set the response token as the model's
  # value.
  scope.onChange = (response) -> scope.$evalAsync ->
    ngModel.$setViewValue response
