exports = module.exports = ->
  controller = (request, response, next) ->
    try response.json request.csrfToken()
    catch e then response.json ""

exports["@singleton"] = true
