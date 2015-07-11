module.exports = (scope, element, attributes, ngModel) ->

  # Specify how the UI should be updated
  ngModel.$render = ->
    viewValue = ngModel.$viewValue or {}
    scope.query = viewValue.query or {}
    scope.options = viewValue.options or {}
