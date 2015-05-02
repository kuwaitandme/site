module.exports = (app) ->
  console.log "[services] initializing"

  app.service "$cache",             require "./cache"
  app.service "$facebook",          require "./facebook"
  app.service "$googleMaps",        require "./googleMaps"
  app.service "$googleRecaptcha",   require "./googleRecaptcha"
  app.service "$imageResizer",      require "./imageResizer"
  app.service "$scroller",          require "./scroller"