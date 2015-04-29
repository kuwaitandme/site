module.exports = (app) ->
  console.log "[directives] initializing"

  # app.directive 'onScroll',    require './onScroll'
  app.directive 'imageLoader', require './imageLoader'
  app.directive 'ngModelFile', require './ngModelFile'