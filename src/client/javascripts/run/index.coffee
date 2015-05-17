module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.run require "./anchorScroll"
  app.run require "./cacheScripts"
  app.run require "./pageLoad"
  app.run require "./stateChangeStart"