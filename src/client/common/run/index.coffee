module.exports = (app) ->
  console.log "[common:run] preparing run stages"
  # app.run require "./cacheScripts"
  app.run require "./pageLoad"
  app.run require "./socketIO"
  app.run require "./stateChangeStart"
  app.run require "./viewContentLoaded"
