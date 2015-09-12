module.exports = (app) ->
  console.log "initializing libraries"
  app.directive "googleRecaptcha", require "./google/reCaptcha/directive"
  app.service "$google/analytics",  require "./google/analytics"
  app.service "@google/recaptcha",  require "./google/reCaptcha/service"