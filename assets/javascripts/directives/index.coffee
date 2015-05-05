module.exports = (app) ->
  console.log "[directives] initializing"

  app.directive "imageLoader", require "./imageLoader"
  app.directive "ngModelFile", require "./ngModelFile"
  app.directive "ngScroll",    require "./ngScroll"