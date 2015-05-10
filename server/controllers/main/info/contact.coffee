exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: "info/contact"
      title: response.__ "title.contact"

    renderer request, response, args, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true