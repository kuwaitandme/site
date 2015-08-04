module.exports = (app) ->
  console.log "[common:models] initializing"

  app.factory "models.categories",    require "./categories"
  # app.factory "models.classifieds",   require "./classifieds"
  app.factory "models.languages",     require "./languages"
  app.factory "models.locations",     require "./locations"
  app.factory "models.messages",      require "./messages"
  app.factory "models.notifications", require "./notifications"
  app.factory "models.users",         require "./users"
