module.exports = (app) ->
  console.log "[services] initializing"

  # app.service "$facebook",          require "./facebook.sdk"
  # app.service "$googleMaps",        require "./google.maps"
  # app.service "$googleRecaptcha",   require "./google.recaptcha"
  # app.service "$google.analytics",  require "./google.analytics"

  app.service "$base64",            require "./base64"
  app.service "$imageResizer",      require "./imageResizer"
  app.service "$notifications",     require "./notifications"
  app.service "$scroller",          require "./scroller"
  app.service "$storage",           require "./storage"

  app.factory "models.categories",  require "./models/categories"
  app.factory "models.classifieds", require "./models/classifieds"
  app.factory "models.languages",   require "./models/languages"
  app.factory "models.locations",   require "./models/locations"
  app.factory "models.users",       require "./models/users"

  # app.service "$socket",            require "./socket"
