###
  This module will set the height and width of the element it was attached to,
  to match the height and width of the viewport. This is really userful when
  dealing with fullscreen images, especially with iOS devices.

  Viewport functions referenced from: http://ryanve.com/lab/dimensions/
###
exports = module.exports = ($window)->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    # on resize
    _setSize = ->
      viewportHeight = document.documentElement.clientHeight
      viewportWidth = document.documentElement.clientWidth
      element.style.height = "#{ viewportHeight }px"
      element.style.width = "#{ viewportWidth }px"

    # Add a listener for the window resize event.
    (angular.element $window).bind "resize", _setSize
    # Call the function for the first time ()
    _setSize()

exports.$inject = ["$window"]