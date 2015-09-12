EventHandler = ($log, $root, $timeout) ->
  logger = $log.init EventHandler.tag
  logger.log "initialized"

  $root.$on "page:start", (event) ->
    logger.log "captured event!"

    # Remove the loading class, so that loading bar gets hidden away.
    $timeout (-> $root.bodyClasses.loading = false), 250


EventHandler.tag = "event:pageStart"
EventHandler.$inject = [
  "$log"
  "$rootScope"
  "$timeout"
]
module.exports = EventHandler