exports = module.exports = ($window, $log) ->
  name: "[scroller]"
  scrollDown: (px) ->
  scrollTo: (eID) ->
    return # Disabled for now

    $log.log @name, "scrolling to ##{eID}"
    isAnimating = true
    html = document.documentElement
    body = document.body

    # Get the height of the document body
    # http://james.padolsey.com/javascript/get-document-height-cross-browser/
    documentHeight = Math.max(
      body.clientHeight
      body.offsetHeight
      body.scrollHeight
      html.clientHeight
      html.offsetHeight
      html.scrollHeight
    )

    # Get the height of the window
    windowHeight =  $window.innerHeight

    # http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
    windowScrollTop = ($window.pageYOffset or html.scrollTop) -
      (html.clientTop or 0)

    # This gets the position (scrollTop) of the target element
    elmYPosition = (eID) ->
      elm = document.getElementById eID
      y = elm.offsetTop
      node = elm
      while node.offsetParent and node.offsetParent != document.body
        node = node.offsetParent
        y += node.offsetTop
      y

    # This calculates the distance we have to scroll
    avail = documentHeight - windowHeight
    scroll = elmYPosition eID
    if scroll > avail then scroll = avail

    # When we set these styles, the animation get triggered.
    html.style.transition = "1s ease-in-out"
    html.style.marginTop = "#{windowScrollTop - scroll}px"

    # This function gets executed whenever the transition gets over.
    onAnimationEnd = (event) ->
      if event.currentTarget is event.target and isAnimating
        body.scrollTop = scroll
        html.style.transition = ""
        html.style.marginTop = ""
        isAnimating = false

    # http://stackoverflow.com/questions/2794148/css3-transition-events
    html.addEventListener "webkitTransitionEnd", onAnimationEnd
    html.addEventListener "transitionend", onAnimationEnd
    html.addEventListener "oTransitionEnd", onAnimationEnd


exports.$inject = ["$window", "$log"]
