module.exports =
  name: "[service:google-maps]"

  onLoad: (callback=->) ->
    waitForElement = ->
      if window.google? and
      window.google.maps? and
      window.google.maps.Circle? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()