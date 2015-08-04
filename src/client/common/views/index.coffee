module.exports = (app) ->
  console.log "[common:views] initializing"
  app.controller "error/404", require "./error/404/controller"
