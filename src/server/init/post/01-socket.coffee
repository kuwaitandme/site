socketSession = require "socket.io-express-session"
socket = require "socket.io"
redisIOstore = require "socket.io-redis"

name = "[socket.io]"


exports = module.exports = (IoC, settings) ->
  app = this

  logger = IoC.create "igloo/logger"
  logger.info name, "initializing"

  # Initialize a Socket.io server and use redis as the adapter
  io = socket app.server
  io.adapter redisIOstore
    host: settings.redis.host
    port: settings.redis.port

  # Now allow the socket to read from the session DB
  io.use socketSession app.sessionInstance

  # Finally for every connection that is made, we add the user to it's own
  # room using the data we get from passport
  io.on "connection", (socket) ->
    id = socket.conn.id
    logger.debug name, "new socket handshake id:#{id}"

    try
      userid = socket.handshake.session.passport.user
      roomName = "user:#{userid}"

      logger.debug name, "assigning id:#{id} room '#{roomName}'"
      socket.join roomName
    catch e then logger.debug name, "not assigning id:#{id} any room"


exports["@require"] = [
  "$container"
  "igloo/settings"
]
