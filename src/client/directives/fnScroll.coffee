exports = module.exports = ($window) ->
  scope: fnScroll: "&"

  link: (scope, element, attributes) ->
    (angular.element $window).bind "scroll", (event) ->
      scrollFn = scope.fnScroll()
      if typeof scrollFn is "function" then scrollFn event

exports.$inject = ["$window"]
