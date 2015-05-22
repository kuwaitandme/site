module.exports = ->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    height = Math.floor element.offsetWidth * attributes.ngRatio
    element.style.height = "#{ height }px"