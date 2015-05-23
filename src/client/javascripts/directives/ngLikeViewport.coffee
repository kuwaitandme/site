###
  This module will set the height and width of the element it was attached to,
  to match the height and width of the viewport. This is really userful when
  dealing with fullscreen images, especially with iOS devices.

  Viewport functions referenced from: http://ryanve.com/lab/dimensions/
###
module.exports = ->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    viewportHeight = document.documentElement.clientHeight
    viewportWidth = document.documentElement.clientWidth
    element.style.height = "#{ viewportHeight }px"
    element.style.width = "#{ viewportWidth }px"