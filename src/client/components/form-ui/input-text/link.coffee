module.exports = (scope, element, attributes, ngModel) ->
  # Assign the placeholder's value
  scope.placeholder = attributes.placeholder
  # Write data to the model
  read = -> ngModel.$setViewValue scope.value
  # Specify how the UI should be updated
  ngModel.$render = -> scope.value = ngModel.$viewValue or ""
  # Listen for change events to enable binding
  input = element.find "input"
  input.on "blur keyup change", -> scope.$evalAsync read
