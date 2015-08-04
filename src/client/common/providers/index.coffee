module.exports = (app) ->
  console.log "[common:providers] initializing"
  app.provider "$environment", require "./environment"
