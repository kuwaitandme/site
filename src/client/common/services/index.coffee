module.exports = (app) ->
  console.log "[common:services] initializing"
  app.service "$base64",            require "./base64"
  app.service "$imageResizer",      require "./imageResizer"
  app.service "$notifications",     require "./notifications"
  app.service "$scroller",          require "./scroller"
  app.service "$storage",           require "./storage"
  app.service "$csrf",              require "./csrf"
  # app.service "$socket",            require "./socket"
