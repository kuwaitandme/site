Controller = module.exports = ->
  (request, response, next) ->
    response.render "main/sharing/create",
      cache: enable: true
      metaRobots: "noindex"


Controller["@routes"] = ["/create"]
Controller["@singleton"] = true