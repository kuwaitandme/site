exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: "about"
      title: response.__ "title.about"

    renderer request, response, args, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true