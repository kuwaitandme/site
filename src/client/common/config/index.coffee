module.exports = (app) ->
  console.log "[app] preparing config stages"
  app.config require "./decorators/$http"
  app.config require "./decorators/$templateCache"
  app.config require "./xhrHttpConfig"
