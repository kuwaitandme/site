module.exports = (app) ->
  app.factory "models.news.categories",     require "./categories"
  app.factory "models.news.stories",        require "./stories"
