module.exports = (app) ->
  console.log "[app] preparing config stages"
  app.config require "./router"
  app.config require "./templateCacheDecorator"
