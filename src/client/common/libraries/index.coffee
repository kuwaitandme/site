module.exports = (app) ->
  console.log "[common:libraries] initializing"

  app.service "$facebook",          require "./facebook/sdk"

  app.service "Facebook",          require "./facebook/sdk"
  app.service "Google.Analytics",  require "./google/analytics"
  app.service "Google.Maps", require "./google/maps/service"
  app.service "Google.reCaptcha", require "./google/reCaptcha/service"

  app.directive "googleRecaptcha", require "./google/reCaptcha/directive"
  app.directive "googleMaps", require "./google/maps/directive"
  app.directive "googleMapsInput", require "./google/maps/input/directive"

  app.directive "masonry",           require "./masonry/directive-master"
  app.directive "masonry-container", require "./masonry/directive-container"
  # app.directive "masonry",         require "./masonry/directive"
