module.exports = (app) ->
  console.log "[app] preparing config stages"
  app.config require "./templateCacheDecorator"
  app.config require "./xhrHttpConfig"
