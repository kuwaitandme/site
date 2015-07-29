exports = module.exports = (Renderer, Categories, Topics) ->
  controller = (request, response, next) ->
    data = {}

    Categories.getBySlug request.params[0]
    .then (category) ->
      data.category = category
      Topics.getLatestByCategory category.id

    .then (topics) ->
      data.topics = topics

      args =
        page: "info/about"
        title: response.__ "forums:title"
        data: data
      Renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/categories"
  "models/forums/topics"
]
exports["@singleton"] = true
