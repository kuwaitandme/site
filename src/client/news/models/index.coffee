module.exports = (app) ->
  console.log "[news:models] initializing"
  app.factory "models.news.categories",     require "./categories"
  app.factory "models.news.stories",        require "./stories"
