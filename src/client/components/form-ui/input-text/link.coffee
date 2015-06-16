module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder
  scope.type = attributes.type or "text"

  # Specify how the UI should be updated
  ngModel.$render = -> scope.value = ngModel.$viewValue

  # Parse the view values before sending them back to the modal to be updated
  ngModel.$parsers.push (viewValue) -> viewValue.trim()

  # Listen for change events to enable binding
  scope.$watch "value", ->
    updateCounter()
    scope.$evalAsync -> ngModel.$setViewValue scope.value

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

  scope.onTouch = -> ngModel.$setTouched()
