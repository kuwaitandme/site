module.exports = (scope, element, attributes, ngModel) ->
  ngModel.$render = -> scope.cat = ngModel.$modelValue or {}