module.exports = (app) ->
  console.log "[libraries] initializing"

  app.service "$facebook",          require "./facebook/sdk"
  app.service "$googleMaps",        require "./google/maps"
  # app.service "$googleRecaptcha",   require "./google/recaptcha"
  app.service "$google.analytics",  require "./google/analytics"

  app.service "Facebook",          require "./facebook/sdk"
  app.service "Google.analytics",  require "./google/analytics"
  app.service "Google.maps", require "./google/maps"
  app.service "Google.reCaptcha", require "./google/reCaptcha/service"
  app.directive "googleRecaptcha", require "./google/reCaptcha/directive"

  app.directive "masonry",           require "./masonry/directive-master"
  app.directive "masonry-container", require "./masonry/directive-container"
  # app.directive "masonry",         require "./masonry/directive"
