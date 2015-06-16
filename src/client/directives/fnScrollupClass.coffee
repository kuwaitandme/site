# This directive is responsible for adding the given class assigned to the
# ng-scrollup-class='' directive when the user has scrolled up and removing it
# when the user has scrolled down .
#
# This is actually only used in the site's header and other use cases haven't
# been found yet.
exports = module.exports = ($timeout, $window) ->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]
    targetClass = attributes.ngScrollupClass
    lastScrollTop = 0
    delta = 5
    didScroll = false
    targetHeight = element.offsetHeight

    hasScrolled = -> $timeout -> scope.$apply ->
      st = $window.scrollY
      if not element.classList? then return
      # Make sure they scroll more than delta
      if Math.abs(lastScrollTop - st) <= delta and st is not 0 then return
      # If they scrolled down and are past the navbar, add the target class.
      # This is necessary so you never see what is "behind" the navbar.
      if st > lastScrollTop and st > targetHeight
        element.classList.add targetClass
      # 'Scroll Up'
      else #if st + $window.innerHeight < document.body.offsetHeight
        element.classList.remove targetClass
      # 'Scroll up' if the window has been resized and the header has hit
      # the top..
      if st is 0 then element.classList.remove targetClass
      lastScrollTop = st


    setInterval =>
      if didScroll
        hasScrolled()
        didScroll = false
    , 250

    (angular.element $window).bind "scroll", -> didScroll = true
    (angular.element $window).bind "resize", -> didScroll = true
    # hasScrolled()

exports.$inject = [
  "$timeout"
  "$window"
  "$log"
]
