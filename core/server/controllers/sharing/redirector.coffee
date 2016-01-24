Controller = module.exports = ->
  controller: (request, response, next) ->
    response.render "main/sharing/create",
      cache: enable: true
      metaRobots: "noindex"


Controller["@singleton"] = true