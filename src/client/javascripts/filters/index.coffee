module.exports = (app) ->
  console.log "[filters] initializing"

  app.filter "category",    require "./category"
  app.filter "link",        require "./link"
  app.filter "location",    require "./location"
  app.filter "prettydate",  require "./prettydate"
  app.filter "price",       require "./price"
  app.filter "status",      require "./status"
  app.filter "translate",   require "./translate"