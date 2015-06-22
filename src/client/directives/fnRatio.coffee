exports = module.exports = ($window)->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]

    onResize = ->
      height = Math.floor element.offsetWidth * attributes.fnRatio
      element.style.height = "#{ height }px"

    (angular.element $window).bind "resize", onResize
    scope.$on "refresh", onResize
    onResize()

exports.$inject = ["$window"]
