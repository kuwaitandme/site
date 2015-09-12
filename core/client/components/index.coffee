module.exports = (app) ->
  console.log "initializing components"

  app.directive "footer",          require "./footer/directive"
  app.directive "header",          require "./header/directive"
  app.directive "headerHamburger", require "./header/hamburger/directive"
  # app.directive "sharingCategory",    require "./sharing-category/directive"
  # app.directive "sharingComment",     require "./sharing-comment/directive"
  # app.directive "sharingItem",        require "./sharing-item/directive"
  app.directive "notifications",   require "./notifications/directive"
  app.directive "f1ormCheckbox",   require "./form/checkbox/directive"

  app.service   "@notifications",  require "./notifications/service"