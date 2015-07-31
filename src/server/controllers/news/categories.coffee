exports = module.exports = (Renderer, Stories) ->
  controller = (request, response, next) ->
    args =
      page: "info/about"
      title: response.__ "news:title"
      data: categories: Stories.categories

    Renderer request, response, args, true


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
