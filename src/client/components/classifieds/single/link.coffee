module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    modelValue = ngModel.$modelValue or {}
    scope.classified = modelValue
