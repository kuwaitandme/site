# if a 404, reload page so that server can show appropriate 404 error..
exports = module.exports = ($log) ->
  $log.log "reloading page"
  # location.reload()


exports.$inject = ["$log"]
