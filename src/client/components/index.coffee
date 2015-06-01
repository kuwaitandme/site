module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.directive "header", require "./header/directive"
