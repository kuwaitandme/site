Promise = require "bluebird"


Controller = module.exports = (Categories) ->
  (request, response, next) ->
    Promise.props
      counters: Categories.getStoryCount()
      categories: Categories.getAll()
    .then (results) ->
      response.render "main/sharing/categories",
        data: results
        metaRobots: "noarchive"
        cache: enable: true


Controller["@routes"] = ["/categories"]
Controller["@require"] = ["models/sharing/categories"]
Controller["@singleton"] = true