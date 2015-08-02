exports = module.exports = (renderer, Stories) ->
  controller = (request, response, next) -> response.redirect "/news/top"
exports["@singleton"] = true
