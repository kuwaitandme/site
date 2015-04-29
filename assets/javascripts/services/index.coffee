module.exports = (app) ->
  console.log "[services] initializing"

  app.service "$cache",      require "./cache"
  app.service "$scroller",   require "./scroller"