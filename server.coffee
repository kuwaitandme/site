IoC      = require "electrolyte"
app      = require "./server/app"

logger   = IoC.create "igloo/logger"
settings = IoC.create "igloo/settings"

app.boot (error) ->
  if error
    logger.error error.message
    if settings.showStack then logger.error error.stack
    process.exit -1
  logger.info "app booted"