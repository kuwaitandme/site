exports = module.exports = ($environment, $location, $log, $window) -> new class
  tag: "service:google/analytics"

  constructor: ->
    @logger = $log.init @tag
    @logger.log "initializing"
    id = $environment.google.analyticsCode
    if not id?
      @logger.warn "disabling google analytics"
      return @fallback = true
    @logger.debug "analytics code", id


  onLoad: (callback=->) ->
    if @fallback then return
    waitForElement = ->
      if $window.ga? then callback()
      else setTimeout (-> waitForElement()), 250
    waitForElement()


  sendPageView: ->
    if @fallback then return
    pageURL = "#{$location.pathname}#{$location.search}#{$location.hash}"
    @logger.log "sending pageview"
    @onLoad -> $window.ga "send", "pageview", page: pageURL


  trackEvent: (category, action, label, value) ->
    @logger.debug "tracking event:", category, "=", action, label
    if @fallback then return
    @onLoad -> $window.ga "send", "event", category, action, label, value


exports.$inject = [
  "@environment"
  "$location"
  "$log"
  "$window"
]