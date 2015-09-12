exports = module.exports = ->
  routes: ["/login"]
  controller: (request, response, next) ->
    response.render "main/auth/login",
      cache: enable: true
      metaRobots: "noindex"


exports["@singleton"] = true