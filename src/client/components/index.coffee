module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.directive "header", require "./header/directive"
  app.directive "classifiedList", require "./classified-list/directive"
  app.directive "classifiedListItem", require "./classified-list-item/directive"
