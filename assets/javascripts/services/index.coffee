module.exports = (app) ->
  console.log "[services] initializing"

  app.service "$facebook",          require "./external/facebook"
  app.service "$googleMaps",        require "./external/google.maps"
  app.service "$googleRecaptcha",   require "./external/google.recaptcha"

  app.service "$imageResizer",      require "./imageResizer"
  app.service "$scroller",          require "./scroller"
  app.service "$storage",           require "./storage"
  app.service "$base64",            require "./base64"
  # app.service "$socket",            require "./socket"