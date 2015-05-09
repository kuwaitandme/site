exports = module.exports = ($window) ->
  name: "[facebook]"
  hasLoaded: false

  onLoad: (callback=->) ->
    # if not hasLoaded then

    # else callback()
    waitForElement = ->
      if $window.FB? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


exports.$inject = ["$window"]