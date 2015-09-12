NotificationService = ($log, $root) ->
  logger = $log.init NotificationService.tag
  logger.log "initializing"


  class Service

    _create: (message, type="success", timeout=5000) ->
      notification =
        message: message
        show: true
        type: type

      console.log notification
      $root.$emit "notifications:add", notification


    error: (message, timeout) ->   @_create message, "error", timeout
    success: (message, timeout) -> @_create message, "success", timeout
    warn: (message, timeout) ->    @_create message, "warn", timeout


  new Service


NotificationService.tag = "service:notifications"
NotificationService.$inject = [
  "$log"
  "$rootScope"
]
module.exports = NotificationService