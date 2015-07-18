exports = module.exports = (renderer, Classifieds) ->
  controller = (request, response, next) ->
    response.status 404
    options =
      page: "errors/404"
      title: "Page not found"
    response.redirect "/news"
    # renderer request, response, options


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true
