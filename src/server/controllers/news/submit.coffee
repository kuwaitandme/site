exports = module.exports = (Renderer) ->
  controller = (request, response, next) ->
    args =
      page: "info/about"
      title: response.__ "news/recent:title"

    Renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
