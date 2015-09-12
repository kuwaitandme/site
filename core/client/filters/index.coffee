module.exports = (app) ->
  console.log "initializing filters"

  app.filter "domain",        require "./domain"
  app.filter "link",          require "./link"
  app.filter "prettydate",    require "./prettydate"
  app.filter "prettynumber",  require "./prettynumber"
  app.filter "translate",     require "./translate"