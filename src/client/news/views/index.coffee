module.exports = (app) ->
  console.log "[news:views] initializing"
  app.controller "news/single",      require "./single/controller"
  app.controller "news/submit",      require "./submit/controller"
  app.controller "news/index",       require "./index/controller"
  app.controller "news/categories",  require "./categories/controller"
