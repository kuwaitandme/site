module.exports = (app) ->
  console.log "[controllers] initializing"

  app.controller 'component:category-list',   require './components/category-list'
  app.controller 'component:classified-list', require './components/classified-list'
  app.controller 'component:header',          require './components/header'
  app.controller 'page:auth/login',           require './pages/auth/login'
  app.controller 'page:auth/signup',          require './pages/auth/signup'
  app.controller 'page:classified/post',      require './pages/classified/post'
  app.controller 'page:classified/single',    require './pages/classified/single'
  app.controller 'page:landing',              require './pages/landing'