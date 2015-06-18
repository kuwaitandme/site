socketEmitter = require "socket.io-emitter"


exports = module.exports = (IoC, settings) ->
  socketEmitter
    host: settings.redis.host
    port: settings.redis.port


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]
