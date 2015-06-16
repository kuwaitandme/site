exports = module.exports = ($location, $log) ->
  $log.log "reloading page"
  $location.reload()
exports.$inject = [
  "$location"
  "$log"
]
