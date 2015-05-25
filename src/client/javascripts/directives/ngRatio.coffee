module.exports = ->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    onResize = ->
      height = Math.floor element.offsetWidth * attributes.ngRatio
      element.style.height = "#{ height }px"
    (angular.element $window).bind "scroll", onResize
    onResize