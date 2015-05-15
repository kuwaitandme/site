exports = module.exports = ->
  controller = (request, response, next) ->
    response.redirect "/auth"


exports["@require"] = []
exports["@singleton"] = true