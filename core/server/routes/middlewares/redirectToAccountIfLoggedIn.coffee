exports = module.exports = ->
  middleware = (request, response, next) ->
    if not request.user then next()
    else response.redirect "/account"


exports["@singleton"] = true