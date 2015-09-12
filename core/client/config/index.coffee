module.exports = (app) ->
  console.log "initializing config files"
  app.config require "./decorators/$http"
  app.config require "./decorators/$templateCache"
  app.config require "./decorators/$log"
  app.config require "./xhrHttpConfig"
