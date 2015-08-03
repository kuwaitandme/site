module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder
  # Write data to the model
  read = -> ngModel.$setViewValue scope.value
  # Specify how the UI should be updated
  ngModel.$render = -> scope.value = ngModel.$viewValue or ""
  # Listen for change events to enable binding
  textarea = element.find "textarea"
  textarea.on "blur keyup change", ->
    updateCounter()
    scope.$evalAsync read


  scope.onTouch = -> ngModel.$setTouched()

  updateCounter = ->
    if not (ngModel.$validators.minlength or ngModel.$validators.maxlength)
      return scope.remainingChars = ""

    min = 0
    max = 0
    try min = Number attributes.minlength
    catch e
    try max = Number attributes.maxlength
    catch e

    val = scope.value or ""
    if val.length < min then scope.remainingChars = val.length - min
    else if max > 0 then scope.remainingChars = max - val.length
    else scope.remainingChars = ""

  updateCounter()
  ngModel.$validate()
