exports = module.exports = ->
  routes: ["/info/contribute"]
  controller: (request, response, next) ->
    response.render "main/info/donate",
      cache: enable: true
      metaRobots: "nofollow"


exports["@singleton"] = true