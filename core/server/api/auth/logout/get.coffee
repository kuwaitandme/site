exports = module.exports = ->
  routes: ["/auth/logout"]

  controller: (request, response, next) ->
    request.session.destroy()
    response.json {}


exports["@singleton"] = true