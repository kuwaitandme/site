module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.directive "classifiedCards", require "./classified-cards/directive"
  app.directive "classifiedList", require "./classified-list/directive"
  app.directive "classifiedListItem", require "./classified-list-item/directive"
  app.directive "classifiedSingle", require "./classified-single/directive"
  app.directive "header", require "./header/directive"
