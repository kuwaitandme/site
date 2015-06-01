module.exports = (app) ->
  console.log "[services] initializing"

  app.factory "model.categories",    require "./categories"
  app.factory "model.classifieds",   require "./classifieds"
  app.factory "model.languages",     require "./languages"
  app.factory "model.locations",     require "./locations"
  app.factory "model.users",         require "./users"