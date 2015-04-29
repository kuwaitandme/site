module.exports =
  name: "[facebook]"

  onLoad: (callback=->) ->
    waitForElement = ->
      if window.FB? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()