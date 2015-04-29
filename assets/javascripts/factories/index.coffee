module.exports = (app) ->
  console.log "[services] initializing"

  app.factory "model.category",   require "./category"
  app.factory "model.classified", require "./classified"
  app.factory "model.user",       require "./user"