module.exports = (app) ->
  console.log "[common:directives] initializing"
  app.directive "fnImageLoader",      require "./fnImageLoader"
  app.directive "fnLikeViewport",     require "./fnLikeViewport"
  app.directive "fnModelFile",        require "./fnModelFile"
  app.directive "fnRatio",            require "./fnRatio"
  app.directive "fnRoute",            require "./fnRoute"
  app.directive "fnScroll",           require "./fnScroll"
  app.directive "fnScrollupClass",    require "./fnScrollupClass"
