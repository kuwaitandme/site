exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: "info/donate"
      # title: response.__ "title.contact"

    renderer request, response, args, true


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true