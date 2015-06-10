module.exports = ($scope, $timeout) ->
  options = $scope.options

  # Since we're can't really attach Angular's amazing form-validation to
  # reflect on the parent scope.. We are writing our own validation rules here.
  #
  # This function executes every time a value has been changed
  onValueChange = (value) ->
    console.log $scope
    if not value? then return
    # Define some conditions
    minimumCondition = options.min and value.length < options.min
    maximumCondition = options.max and value.length > options.max
    # Calculate the error/warning booleans based on our conditions
    warningCondition = minimumCondition
    errorCondition = maximumCondition
    # Update the value back to the parent modal..
    $scope.formClasses.error = errorCondition
    $scope.formClasses.warning = warningCondition
    $scope.formClasses.success = not (errorCondition or warningCondition)
    $scope.value = value

  # Attach handler to listener for the different values
  _attach = (field) -> $scope.$watch field, onValueChange
  if $scope.fieldType == "input" then _attach "inputValue"
  if $scope.fieldType == "textarea" then _attach "textareaValue"
