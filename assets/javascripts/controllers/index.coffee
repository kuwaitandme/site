module.exports = (app) ->
  console.log "[controllers] initializing"

  app.controller "component:category-list",      require "./components/category-list"
  app.controller "component:classified-list",    require "./components/classified-list"
  app.controller "component:classified-single",  require "./components/classified-single"
  app.controller "component:header",             require "./components/header"

  app.controller "page:404",                     require "./pages/404"
  app.controller "page:account/index",           require "./pages/account"
  app.controller "page:account/manage",          require "./pages/account/manage"
  app.controller "page:auth/login",              require "./pages/auth/login"
  app.controller "page:auth/logout",             require "./pages/auth/logout"
  app.controller "page:auth/signup",             require "./pages/auth/signup"
  app.controller "page:classified/finish",       require "./pages/classified/finish"
  app.controller "page:classified/post",         require "./pages/classified/post"
  app.controller "page:classified/search",       require "./pages/classified/search"
  app.controller "page:classified/single",       require "./pages/classified/single"
  app.controller "page:landing",                 require "./pages/landing"