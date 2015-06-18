module.exports = (app) ->
  console.log "[models] initializing"

  app.factory "models.categories",    require "./categories"
  app.factory "models.classifieds",   require "./classifieds"
  app.factory "models.languages",     require "./languages"
  app.factory "models.locations",     require "./locations"
  app.factory "models.users",         require "./users"
  app.factory "models.notifications", require "./notifications"
