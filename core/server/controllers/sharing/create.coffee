exports = module.exports = ->
  routes: ["/create"]

  controller: (request, response, next) ->
    response.render "main/sharing/create",
      cache: enable: true
      metaRobots: "noindex"


exports["@singleton"] = true