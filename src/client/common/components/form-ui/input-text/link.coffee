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

  # TODO: replace with
  emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

  # Rewrite the isEmpty condition
  ngModel.$isEmpty = (value) ->
    if scope.type == "email" then not (value and emailRegex.test value)
    else not value?


  updateCounter()
  ngModel.$validate()

  scope.onTouch = -> ngModel.$setTouched()
