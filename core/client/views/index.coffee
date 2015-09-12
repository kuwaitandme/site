module.exports = (app) ->
  console.log "initializing views"

  app.controller "error/404",          require "./error/404/controller"

  app.controller "info/about",         require "./info/about/controller"
  app.controller "info/contribute",    require "./info/terms-privacy/controller"
  app.controller "info/terms-privacy", require "./info/terms-privacy/controller"

  # app.controller "auth/forgot",      require "./auth/login/controller"
  app.controller "auth/login",         require "./auth/login/controller"
  app.controller "auth/logout",        require "./auth/logout/controller"
  app.controller "auth/signup",        require "./auth/signup/controller"

  app.controller "sharing/categories",    require "./sharing/categories/controller"
  app.controller "sharing/category",      require "./sharing/category/controller"
  app.controller "sharing/filters",       require "./sharing/filters/controller"
  app.controller "sharing/index",         require "./sharing/index/controller"
  app.controller "sharing/recent",        require "./sharing/recent/controller"
  app.controller "sharing/search",        require "./sharing/search/controller"
  app.controller "sharing/settings",      require "./sharing/settings/controller"
  app.controller "sharing/single",        require "./sharing/single/controller"
  app.controller "sharing/submit",        require "./sharing/submit/controller"