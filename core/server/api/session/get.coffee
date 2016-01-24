Controller = module.exports = ->
  (request, response, next) ->
    if request.user? then response.json request.user
    else response.json {}


Controller["@routes"] = ["/session"]
Controller["@singleton"] = true