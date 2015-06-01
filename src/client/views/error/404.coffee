exports = module.exports = ($location) ->
  console.log "reloading page"
  $location.reload()
exports.$inject = ["$location"]