module.exports = (app) ->
  console.log "[controllers] initializing"

  app.controller 'page:landing',              require './pages/landing'
  app.controller 'page:classified/single',    require './pages/classified/single'
  app.controller 'page:classified/post',      require './pages/classified/post'
  app.controller 'component:classified-list', require './components/classified-list'
  app.controller 'component:category-list',   require './components/category-list'