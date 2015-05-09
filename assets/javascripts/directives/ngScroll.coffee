$xports = module.exports = ($window)->
  scope: ngScroll: "&"

  link: (scope, element, attributes) ->
    (angular.element $window).bind "scroll", (event) ->
      scrollFn = scope.ngScroll()
      if typeof scrollFn is "function" then scrollFn event

exports.$inject = ["$window"]