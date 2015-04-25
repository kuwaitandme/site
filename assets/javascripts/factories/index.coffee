module.exports = (app) ->
  console.log "[services] initializing"

  app.factory 'cache', require './cache'