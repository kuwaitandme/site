exports = module.exports = ->
  (request, response, next) ->
    request.session.destroy()
    response.json "session destroyed"