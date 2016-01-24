Controller = module.exports = ->
  (request, response, next) ->
    response.render "main/info/about",
      cache: enable: true
      metaRobots: "nofollow"


Controller["@routes"] = ["/info/about"]
Controller["@singleton"] = true