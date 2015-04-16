module.exports = class Facebook
  name: "[facebook]"

  constructor: ->
    console.log @name, 'initializing'
    @onLoad => console.log @name, 'loaded'

  onLoad: (callback=->) ->
    waitForElement = ->
      if window.FB? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()