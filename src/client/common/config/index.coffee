module.exports = (app) ->
  console.log "[common:config] initializing"
  app.config require "./decorators/$http"
  app.config require "./decorators/$templateCache"
  app.config require "./xhrHttpConfig"
