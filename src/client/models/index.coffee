module.exports = (app) ->
  console.log "[models] initializing"

  app.factory "models.categories",    require "./categories"
  app.factory "models.classifieds",   require "./classifieds"
  app.factory "models.languages",     require "./languages"
  app.factory "models.locations",     require "./locations"
  app.factory "models.messages",      require "./messages"
  app.factory "models.notifications", require "./notifications"
  app.factory "models.users",         require "./users"
  app.factory "models.forums.categories",         require "./forums/categories"

  app.factory "models.forums.topics",         require "./forums/topics"
