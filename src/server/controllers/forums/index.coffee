exports = module.exports = (renderer, Categories) ->
  controller = (request, response, next) ->
    Categories.query({}, page: request.params[0] or 1).then (data) ->

      args =
        page: "info/about"
        title: response.__ "forums:title"
        data: data

      renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/categories"
]
exports["@singleton"] = true
