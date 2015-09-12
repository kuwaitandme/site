exports = module.exports = ->
  middleware = (request, response, next) ->
    if not request.user or parseInt(request.user.id, 10) is 0
      redirectToLogin request, response, next
    else next()


exports["@singleton"] = true