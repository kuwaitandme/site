module.exports = class GoogleRecaptcha
  name: "[google-recaptcha]"

  constructor: ->
    console.log @name, 'initializing'
    @onLoad => console.log @name, 'loaded'

  onLoad: (callback=->) ->
    waitForElement = ->
      if window.grecaptcha? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()