module.exports = (app) ->
  console.log "[directives] initializifn"
  app.directive "fnImageLoader",      require "./fnImageLoader"
  app.directive "fnLikeViewport",     require "./fnLikeViewport"
  app.directive "fnMasonry",          require "./fnMasonry"
  app.directive "fnModelFile",        require "./fnModelFile"
  app.directive "fnRatio",            require "./fnRatio"
  app.directive "fnScroll",           require "./fnScroll"
  app.directive "fnScrollupClass",    require "./fnScrollupClass"
