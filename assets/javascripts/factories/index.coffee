module.exports = (app) ->
  console.log "[services] initializing"

  app.factory "model.categories",    require "./categories"
  app.factory "model.classifieds",   require "./classifieds"
  app.factory "model.locations",     require "./locations"
  app.factory "model.notifications", require "./notifications"
  app.factory "model.users",         require "./users"