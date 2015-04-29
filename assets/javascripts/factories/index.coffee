module.exports = (app) ->
  console.log "[services] initializing"

  app.factory "category",   require "./category"
  app.factory "classified", require "./classified"
  app.factory "user",       require "./user"