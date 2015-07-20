module.exports = (app) ->
  console.log "[filters] initializing"

  app.filter "category",      require "./category"
  app.filter "domain",        require "./domain"
  app.filter "link",          require "./link"
  app.filter "location",      require "./location"
  app.filter "prettydate",    require "./prettydate"
  app.filter "prettynumber",  require "./prettynumber"
  app.filter "price",         require "./price"
  app.filter "status",        require "./status"
  app.filter "translate",     require "./translate"
