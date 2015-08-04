module.exports = (app) ->
  console.log "[common:components] initializing"

  app.directive "header", require "./header/directive"
  app.directive "headerHamburger", require "./header/hamburger/directive"
  app.directive "notifications", require "./notifications/directive"
  app.directive "modal", require "./modal/directive"

  # app.directive "formUi", require "./form-ui/directive"
  # app.directive "inputSelect", require "./form-ui/input-select/directive"
  # app.directive "inputTextarea", require "./form-ui/directive"f7
  app.directive "inputKeywords", require "./form-ui/input-keywords/directive"
  app.directive "inputCategory", require "./form-ui/input-category/directive"
  app.directive "inputCheckboxIcon", require "./form-ui/input-checkbox-icon/directive"
  app.directive "inputImages", require "./form-ui/input-images/directive"
  app.directive "inputLongList", require "./form-ui/input-long-list/directive"
  app.directive "inputList", require "./form-ui/input-list/directive"
  app.directive "inputPrice", require "./form-ui/input-price/directive"
  app.directive "inputPriceRange", require "./form-ui/input-price-range/directive"
  app.directive "inputTel", require "./form-ui/input-tel/directive"
  app.directive "inputText", require "./form-ui/input-text/directive"
  app.directive "inputTextarea", require "./form-ui/input-textarea/directive"
  app.directive "csrf", require "./form-ui/csrf/directive"


  # app.directive "filterbox", require "./filterbox/directive"

  app.factory "modal", require "./modal/factory"
