exports = module.exports = (renderer, Stories) ->
  controller = (request, response, next) ->
    Stories.recent({}, page: request.params[0] or 1).then (stories) ->

      args =
        page: "info/about"
        title: response.__ "news/recent:title"
        data: stories

      renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
