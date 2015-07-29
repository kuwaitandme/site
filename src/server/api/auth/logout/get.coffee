exports = module.exports = -> (request, response, next) ->
  request.session.destroy()
  response.json {}


exports["@singleton"] = true
