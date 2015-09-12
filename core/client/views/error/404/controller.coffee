# if a 404, reload page so that server can show appropriate 404 error..
Controller = ($log) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  location.reload()


Controller.tag = "error/404"
Controller.$inject = ["$log"]
module.exports = Controller