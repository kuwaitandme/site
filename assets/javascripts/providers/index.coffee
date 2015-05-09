module.exports = (app) ->
  console.log "[providers] initializing"
  app.provider "environment", require "./environment"