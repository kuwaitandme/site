module.exports = (app) ->
  console.log "initializing run stages"
  app.run require "./events/pageInitialize"
  app.run require "./events/pageStart"
  app.run require "./events/pageModify"
  app.run require "./events/stateChangeStart"
  app.run require "./notifications"