module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  scope.onTouch = -> ngModel.$setTouched()

  # targetItem contains the id of the selected element, which is set by the
  # controller.
  scope.$watch "targetItem", (value) ->
    if value? then scope.focused = false
    scope.$evalAsync -> ngModel.$setViewValue value


  ngModel.$render = ->
    for item in (scope.list or [])
      if item.id is ngModel.$modelValue then scope.setItem item
