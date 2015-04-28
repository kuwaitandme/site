exports = module.exports = ->
  (request, response, next) ->
    request.session.destroy()
    response.end '"session destroyed"'