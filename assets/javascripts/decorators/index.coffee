module.exports = (app) ->
  console.log "[decorators] initializing"
  app.config require './templateCache'