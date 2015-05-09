module.exports = (app) ->
  console.log "[services] initializing"

  app.service "$facebook",          require "./facebook"
  app.service "$googleMaps",        require "./googleMaps"
  app.service "$googleRecaptcha",   require "./googleRecaptcha"
  app.service "$imageResizer",      require "./imageResizer"
  app.service "$scroller",          require "./scroller"
  app.service "$storage",           require "./storage"
  app.service "$base64",            require "./base64"
  # app.service "$socket",            require "./socket"