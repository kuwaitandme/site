exports = module.exports = (renderer, Stories) ->
  controller = (request, response, next) ->
    Stories.top({}, page: request.params[0] or 1).then (data) ->

      args =
        page: "info/about"
        title: response.__ "news:title"
        data: data

      renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
