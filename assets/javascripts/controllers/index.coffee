module.exports = (app) ->
  console.log "[controllers] initializing"

  app.controller 'page:landing',              require './pages/landing'
  app.controller 'partials:classified-list',  require './partials/classified-list'
  app.controller 'partials:category-list',    require './partials/category-list'