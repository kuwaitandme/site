module.exports = (app) ->
  console.log "[common:values] initializing"
  app.value "$anchorScroll", angular.noop
  app.value "$log", console
