exports = module.exports = (renderer, Classifieds) ->
  controller = (request, response, next) ->
    args =
      page: "errors/404"
      title: "Page not found"
    renderer request, response, args, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true