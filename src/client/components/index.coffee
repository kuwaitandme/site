module.exports = (app) ->
  console.log "[run] preparing run stages"
  app.directive "categoryList", require "./category-list/directive"

  app.directive "classifiedCards", require "./classifieds/cards/directive"
  app.directive "classifiedForm", require "./classifieds/form/directive"
  app.directive "classifiedInteractiveList", require "./classifieds/interactive-list/directive"
  app.directive "classifiedList", require "./classifieds/list/directive"
  app.directive "classifiedListItem", require "./classifieds/list/item/directive"
  app.directive "classifiedSingle", require "./classifieds/single/directive"

  app.directive "header", require "./header/directive"
  app.directive "auth", require "./auth/directive"

  # app.directive "formUi", require "./form-ui/directive"
  app.directive "inputText", require "./form-ui/input-text/directive"
  app.directive "inputTextarea", require "./form-ui/input-textarea/directive"
  app.directive "inputPrice", require "./form-ui/input-price/directive"
  app.directive "inputLongList", require "./form-ui/input-long-list/directive"
  # app.directive "inputSelect", require "./form-ui/input-select/directive"
  app.directive "inputCategory", require "./form-ui/input-category/directive"
  # app.directive "inputTextarea", require "./form-ui/directive"
