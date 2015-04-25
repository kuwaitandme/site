module.exports = (app) ->
  console.log "[services] initializing"
  app.service "classified", require "./classified"
  app.service "category", require "./category"