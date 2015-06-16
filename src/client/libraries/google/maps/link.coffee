module.exports = (scope, element, attributes, ngModel) ->
  ngModel.$render = ->
    model = ngModel.$modelValue or {}
    scope.gmapX = model.gmapX
    scope.gmapY = model.gmapY
