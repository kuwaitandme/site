module.exports = (app) ->
  console.log "[app] preparing run stages"
  app.run require "./anchorScroll"
  app.run require "./stateChange"