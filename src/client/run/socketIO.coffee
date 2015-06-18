exports = module.exports = ($log, $root, ga) ->
  body = document.body
  name = "[run:socket.io]"
  $log.log name, "initialized"
  socket = io()
  socket.emit 'blah', { my: 'data' }
  socket.on 'news', (data) ->
    console.log("gotscoket",data)
  # });



exports.$inject = [
  "$log"
  "$rootScope"

  "Google.Analytics"
]
