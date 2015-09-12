RunStage = ($location, $log, $timeout, Notifications) ->
  logger = $log.init RunStage.tag
  logger.log "parsing URL"

  query = $location.search()

  $timeout(1000).then ->
    if query._error?   then Notifications.error   query._error
    if query._success? then Notifications.success query._success
    if query._warn?    then Notifications.warn    query._warn

    $location.search "_error",   null
    $location.search "_success", null
    $location.search "_warn",    null


RunStage.tag = "run:notifications"
RunStage.$inject = [
  "$location"
  "$log"
  "$timeout"
  "@notifications"
]
module.exports = RunStage