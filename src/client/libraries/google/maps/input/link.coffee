module.exports = (scope, element, attributes, ngModel) ->

  # This function gets called whenever the user click/drags the marker or sets
  # a new position.
  scope.onUpdate = (X, Y) ->
    scope.$evalAsync -> ngModel.$setViewValue gmapX: X, gmapY: Y

  ngModel.$render = ->
    model = ngModel.$modelValue or {}
    scope.gmapX = model.gmapX
    scope.gmapY = model.gmapY
