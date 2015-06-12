module.exports = (scope, element, attributes, ngModel) ->
  scope.placeholder = attributes.placeholder

  scope.setItem = (item) ->
    scope.userInput = item.name
    scope.targetItem = item

  scope.onTouch = -> ngModel.$setTouched()

  scope.$watch "targetItem", (value={}) ->
    scope.$evalAsync -> ngModel.$setViewValue value.id

  # Specify how the UI should be updated
  ngModel.$render = ->
    scope.images = ngModel.$modelValue or []
