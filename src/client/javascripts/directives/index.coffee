module.exports = (app) ->
  console.log "[directives] initializing"
  app.directive "ngImageLoader", require "./ngImageLoader"
  app.directive "ngModelFile",   require "./ngModelFile"
  app.directive "ngRatio",       require "./ngRatio"
  app.directive "ngScroll",      require "./ngScroll"