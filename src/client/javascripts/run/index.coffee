module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.run require "./anchorScroll"
  app.run require "./stateChangeStart"
  app.run require "./cacheScripts"