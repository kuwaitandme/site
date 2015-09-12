recluster = require "recluster"
path      = require "path"
IoC       = require "electrolyte"

name = "[cluster]"
cluster = recluster path.join __dirname, "app.coffee"

IoC.loader IoC.node path.join __dirname, "boot"
IoC.loader "igloo", require "igloo"

logger = IoC.create "igloo/logger"


cluster.run()


# reloading cluster
process.on "SIGUSR2", ->
  logger.info name, "received SIGUSR2, reloading cluster..."
  cluster.reload()


# spawned cluster process.id
# run kill -s SIGUSR2 to reload
logger.info name, "spawned cluster, `kill -s SIGUSR2 %d` to reload", process.pid
