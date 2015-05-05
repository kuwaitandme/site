exports = module.exports = ($window) ->
  name: "[facebook]"

  onLoad: (callback=->) ->
    waitForElement = ->
      if $window.FB? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


exports.$inject = ["$window"]