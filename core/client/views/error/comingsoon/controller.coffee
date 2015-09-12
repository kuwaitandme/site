Controller = ($log) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  location.reload()


Controller.tag = "error/comingsoon"
Controller.$inject = ["$log"]
module.exports = Controller