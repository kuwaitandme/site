exports = module.exports = ->

  controller = (request, response, next) ->
    response.json request.csrfToken()

exports["@singleton"] = true
