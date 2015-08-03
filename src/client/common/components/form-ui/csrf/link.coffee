module.exports = (scope, element, attributes, ngModel) ->
  scope.$watch "token", (v) -> scope.$evalAsync -> ngModel.$setViewValue v
