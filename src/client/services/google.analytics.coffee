exports = module.exports = ($environment, $location, $log, $window) -> new class
  name: "[service:google-analytics]"

  constructor: ->
    $log.log @name, "initializing"
    id = $environment.google.analyticsCode

    if not id?
      $log.warn @name, "disabling google analytics"
      return @fallback = true
    $log.debug @name, "analytics code", id

    # # Prepare the URL
    # url = "https://www.google-analytics.com/analytics.js"
    # # Insert the script into the DOM
    # $fileref = document.createElement "script"
    # $fileref.type = "text/javascript"
    # $fileref.src = url
    # head = (document.getElementsByTagName "head")[0]
    # head.insertBefore $fileref, head.firstChild

    # @onLoad -> $window.ga "create", id, "auto"


  onLoad: (callback=->) ->
    if @fallback then return
    waitForElement = =>
      if $window.ga? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


  sendPageView: ->
    if @fallback then return
    pageURL = "#{$location.pathname}#{$location.search}#{$location.hash}"
    $log.log @name, "sending pageview"
    @onLoad -> $window.ga "send", "pageview", page: pageURL


  trackEvent: (category, action, label, value) ->
    if @fallback then return
    $log.log @name, "sending event"
    @onLoad -> $window.ga "send", "event", category, action, label, value


exports.$inject = [
  "$environment"
  "$location"
  "$log"
  "$window"
]