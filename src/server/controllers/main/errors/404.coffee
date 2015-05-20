exports = module.exports = (renderer, Classifieds) ->
  controller = (request, response, next) ->
    response.status 404
    args =
      page: "errors/404"
      title: "Page not found"
    renderer request, response, args, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true