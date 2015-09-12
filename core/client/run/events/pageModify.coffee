EventHandler = ($log, $root, $state, $timeout, Environment, Languages) ->
  logger = $log.init EventHandler.tag
  logger.log "initialized"

  $root.bodyClasses ?= {}

  handler = (event, value={}) ->
    logger.log "captured event!"
    setTitle = ->
      title = value.title or Languages.translate "title", $state.current.page
      if title == "" then document.title = "#{Environment.sitename}"
      else document.title = "#{title} - #{Environment.sitename}"
    setTitle()
    $root.$on "model:language:change", setTitle

  $root.$on "$stateChangeSuccess", handler
  $root.$on "page:modify", handler



EventHandler.tag = "event:pageModify"
EventHandler.$inject = [
  "$log"
  "$rootScope"
  "$state"
  "$timeout"
  "@environment"
  "@models/languages"
]
module.exports = EventHandler