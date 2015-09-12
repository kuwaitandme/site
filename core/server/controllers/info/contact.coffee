exports = module.exports = ->
  routes: ["/info/contact"]
  controller: (request, response, next) ->
    response.render "main/info/contact",
      cache: enable: true
      metaRobots: "nofollow"


exports["@singleton"] = true