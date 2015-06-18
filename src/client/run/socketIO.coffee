exports = module.exports = ($log, $root, ga) ->
  body = document.body
  name = "[run:socket.io]"
  $log.log name, "initialized"
  io()


exports.$inject = [
  "$log"
  "$rootScope"

  "Google.Analytics"
]
