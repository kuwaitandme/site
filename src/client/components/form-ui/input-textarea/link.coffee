module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder
  # Write data to the model
  read = -> ngModel.$setViewValue scope.value
  # Specify how the UI should be updated
  ngModel.$render = -> scope.value = ngModel.$viewValue or ""
  # Listen for change events to enable binding
  textarea = element.find "textarea"
  textarea.on "blur keyup change", -> scope.$evalAsync read
