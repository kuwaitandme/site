module.exports = ->
  name: "[google-recaptcha]"

  onLoad: (callback=->) ->
    waitForElement = ->
      if window.grecaptcha? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()