exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: "info/about"
      title: response.__ "title.about"

    renderer request, response, args, true


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true