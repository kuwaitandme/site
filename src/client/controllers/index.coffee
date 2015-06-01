module.exports = (app) ->
  console.log "[controllers] initializing"

  app.controller "master",                       require "./master"

  app.controller "component:category-list",      require "./components/category-list"
  app.controller "component:classified-list",    require "./components/classified-list"
  app.controller "component:classified-single",  require "./components/classified-single"
  app.controller "component:classified-form",    require "./components/classified-form"
  app.controller "component:header",             require "./components/header"

  app.controller "page:404",                     require "./pages/404"
  app.controller "page:account/index",           require "./pages/account"
  app.controller "page:account/manage",          require "./pages/account/manage"
  app.controller "page:auth/index",              require "./pages/auth"
  app.controller "page:auth/logout",             require "./pages/auth/logout"
  app.controller "page:classified/edit",         require "./pages/classified/edit"
  app.controller "page:classified/finish",       require "./pages/classified/finish"
  app.controller "page:classified/post",         require "./pages/classified/post"
  app.controller "page:classified/search",       require "./pages/classified/search"
  app.controller "page:classified/single",       require "./pages/classified/single"
  app.controller "page:landing",                 require "./pages/landing"