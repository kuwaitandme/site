module.exports = (app) ->
  console.log "[filters] initializing"

  app.filter 'prettydate',  require './prettydate'
  app.filter 'price',       require './price'
  app.filter 'translate',   require './translate'