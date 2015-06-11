module.exports = (scope, element, attrs, ngModel) ->
  if not ngModel? then return
  input = element.find "input"
  placeholder = element.find "div"
  placeholder[0].innerHTML = attrs.placeholder

  # Write data to the model
  read = -> ngModel.$setViewValue input.val()

  # Specify how the UI should be updated
  ngModel.$render = -> input.val ngModel.$viewValue or ""

  # Listen for change events to enable binding
  input.on "blur keyup change", -> scope.$evalAsync read
