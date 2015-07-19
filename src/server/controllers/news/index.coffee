exports = module.exports = (renderer, Stories) ->
  controller = (request, response, next) ->
    Stories.query().then (stories) ->

      args =
        page: "info/about"
        title: response.__ "title:news"
        data: stories

      renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
