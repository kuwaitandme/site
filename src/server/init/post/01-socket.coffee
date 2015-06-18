iosSession = require "socket.io-express-session"
ios = require "socket.io"


exports = module.exports = (IoC, settings) ->
  app = this
  logger = IoC.create "igloo/logger"
  name = "[socket.io]"


  logger.info name, "initializing"
  io = ios app.server
  io.use iosSession app.sessionInstance

  io.on 'connection', (socket) ->
    console.log name, socket.handshake.session

exports["@require"] = [
  "$container"
  "igloo/settings"
]
