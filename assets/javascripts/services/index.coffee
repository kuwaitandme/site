module.exports = (app) ->
  console.log "[services] initializing"

  app.service "$facebook",          require "./facebook.sdk"
  app.service "$googleMaps",        require "./google.maps"
  app.service "$googleRecaptcha",   require "./google.recaptcha"

  app.service "$imageResizer",      require "./imageResizer"
  app.service "$scroller",          require "./scroller"
  app.service "$storage",           require "./storage"
  app.service "$base64",            require "./base64"
  # app.service "$socket",            require "./socket"