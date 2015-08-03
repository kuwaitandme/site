module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  scope.$watch "images", (value=[]) ->
    scope.$evalAsync -> ngModel.$setViewValue value

  # Specify how the UI should be updated
  ngModel.$render = -> scope.images = ngModel.$modelValue or []
