exports = module.exports = (Renderer, Stories) ->
  controller = (request, response, next) ->
    options =
      page: "news/categories"
      data: categories: Stories.categories
    Renderer request, response, options


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
