exports = module.exports = ($environment, $location, $log, $window) -> new class
  name: "[service:google-analytics]"

  constructor: ->
    $log.log @name, "initializing"
    id = $environment.google.analyticsCode
    if not id?
      $log.warn @name, "disabling google analytics"
      return @fallback = true
    $log.debug @name, "analytics code", id


  onLoad: (callback=->) ->
    if @fallback then return
    waitForElement = ->
      if $window.ga? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


  sendPageView: ->
    if @fallback then return
    pageURL = "#{$location.pathname}#{$location.search}#{$location.hash}"
    $log.log @name, "sending pageview"
    @onLoad -> $window.ga "send", "pageview", page: pageURL


  trackEvent: (category, action, label, value) ->
    $log.debug @name, "tracking event:", category, "=", action, label
    if @fallback then return
    @onLoad -> $window.ga "send", "event", category, action, label, value


exports.$inject = [
  "$environment"
  "$location"
  "$log"
  "$window"
]
