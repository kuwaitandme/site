exports = module.exports = ($window)->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    multiplier = (Number attributes.ngLikeViewport) or 1
    height = document.documentElement.clientHeight * multiplier
    width = document.documentElement.clientWidth
    element.style.height = "#{ height }px"
    element.style.width = "#{ width }px"

exports.$inject = ["$window"]