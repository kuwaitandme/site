module.exports = (scope, element, attributes, ngModel) ->
  # Assign the placeholder's value
  scope.placeholder = attributes.placeholder

  # Specify how the UI should be updated
  ngModel.$render = -> scope.value = ngModel.$viewValue

  # Parse the view values before sending them back to the modal to be updated
  ngModel.$parsers.push (viewValue) -> viewValue.trim()

  # Listen for change events to enable binding
  scope.$watch "value", -> scope.$evalAsync -> ngModel.$setViewValue scope.value
