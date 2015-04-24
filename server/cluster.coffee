recluster = require 'recluster'
path      = require 'path'
IoC       = require 'electrolyte'

cluster = recluster path.join __dirname, 'app.coffee'

IoC.loader IoC.node path.join __dirname, 'boot'
IoC.loader 'igloo', require 'igloo'

logger = IoC.create 'igloo/logger'

cluster.run()
process.on 'SIGUSR2', ->
  # reloading cluster
  logger.info 'received SIGUSR2, reloading cluster...'
  cluster.reload()

# spawned cluster process.id
# run kill -s SIGUSR2 to reload
logger.info 'spawned cluster, `kill -s SIGUSR2 %d` to reload', process.pid