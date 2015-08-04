module.exports = (app) ->
  console.log "[components] initializing"
  app.directive "newsItem", require "./news-item/directive"
  app.directive "newsComment", require "./news-comment/directive"
