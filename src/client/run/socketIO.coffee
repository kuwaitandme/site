exports = module.exports = ($log, Notifications) ->
  body = document.body
  name = "[run:socket.io]"
  $log.log name, "initialized"

  # socket = io()
  # socket.on "notifications", (d) -> Notifications.add d


exports.$inject = [
  "$log"

  "models.notifications"
]
