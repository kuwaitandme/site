module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    if not ngModel.$modelValue? then return
    scope.cl = ngModel.$modelValue or {}
