module.exports = (app) ->
  console.log "[app] settings values"
  app.value "$anchorScroll", angular.noop
  app.value "$log", console
