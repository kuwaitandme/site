module.exports = (scope, element, attributes, ngModel) ->
  # Assign the placeholder's value
  scope.placeholder = attributes.placeholder

  # Listen for change events to enable binding
  scope.toggle = -> scope.$evalAsync ->
    scope.toggled = !scope.toggled
    ngModel.$setViewValue !!scope.toggled

  # Specify how the UI should be updated
  ngModel.$render = -> scope.toggled = ngModel.$viewValue
