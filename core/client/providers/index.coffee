module.exports = (app) ->
  console.log "initializing providers"
  app.provider "@environment", require "./environment"
  app.provider "@i18n", require "./i18n"