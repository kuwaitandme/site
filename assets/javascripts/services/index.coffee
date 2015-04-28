module.exports = (app) ->
  console.log "[services] initializing"

  app.service "category",   require "./category"
  app.service "classified", require "./classified"
  app.service "user",       require "./user"