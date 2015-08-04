exports = module.exports = (Renderer) ->
  controller = (request, response, next) ->
    args = page: "news/submit"

    Renderer request, response, args, true
    .catch (e) -> next e


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
