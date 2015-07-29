exports = module.exports = (Renderer, Topics) ->
  controller = (request, response, next) ->
    data = {}

    Topics.getBySlug request.params[0]
    .then (topic) ->
      args =
        page: "info/about"
        title: response.__ "forums:title"
        data: topic
      Renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/topics"
]
exports["@singleton"] = true
