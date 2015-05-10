exports = module.exports = ($window) ->
  name: "[google-analytics]"

  onLoad: (callback=->) ->
    waitForElement = ->
      if $window.grecaptcha? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


exports.$inject = ["$window"]