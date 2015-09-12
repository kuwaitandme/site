exports = module.exports = ->
  routes: ["/signup"]
  controller: (request, response, next) ->
    response.render "main/auth/signup",
      cache: enable: true
      metaRobots: "noindex"


exports["@singleton"] = true