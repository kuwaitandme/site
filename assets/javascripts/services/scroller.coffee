module.exports = ->
  name: "[scroller]"
  scrollTo: (eID) ->
    console.log @name, "scrolling to", eID

    currentYPosition = ->
      # Firefox, Chrome, Opera, Safari
      if self.pageYOffset
        return self.pageYOffset
      # Internet Explorer 6 - standards mode
      if document.documentElement and document.documentElement.scrollTop
        return document.documentElement.scrollTop
      # Internet Explorer 6, 7 and 8
      if document.body.scrollTop
        return document.body.scrollTop
      0

    elmYPosition = (eID) ->
      elm = document.getElementById eID
      y = elm.offsetTop
      node = elm
      while node.offsetParent and node.offsetParent != document.body
        node = node.offsetParent
        y += node.offsetTop
      y

    # This scrolling function
    # is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
    startY = currentYPosition()
    stopY = elmYPosition eID
    distance = if stopY > startY then stopY - startY else startY - topY

    if distance < 100 then return @scrollTo 0, stopY

    speed = Math.round distance / 100
    if speed >= 20 then speed = 20
    speed = 20
    step = Math.round distance / 25
    leapY = if stopY > startY then startY + step else startY - step
    timer = 0

    if stopY > startY
      i = startY
      while i < stopY
        setTimeout "window.scrollTo(0, #{leapY})", timer * speed
        leapY += step
        if leapY > stopY then leapY = stopY
        timer++
        i += step
      return

    i = startY
    while i > stopY
      setTimeout "window.scrollTo(0, #{leapY})", timer * speed
      leapY -= step
      if leapY < stopY then leapY = stopY
      timer++
      i -= step