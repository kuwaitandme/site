exports = module.exports = ->
  routes: ["/info/about"]
  controller: (request, response, next) ->
    response.render "main/info/about",
      cache: enable: true
      metaRobots: "nofollow"


exports["@singleton"] = true