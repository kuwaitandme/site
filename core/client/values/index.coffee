module.exports = (app) ->
  console.log "initializing values"
  app.value "$anchorScroll", angular.noop
  app.value "$log", console
