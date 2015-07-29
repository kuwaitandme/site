exports = module.exports = (renderer, Topics) ->
  controller = (request, response, next) ->
    Topics.query({}, page: request.params[0] or 1).then (data) ->


      args =
        page: "info/about"
        title: response.__ "forums:title"
        data: topics: data

      renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/topics"
]
exports["@singleton"] = true
