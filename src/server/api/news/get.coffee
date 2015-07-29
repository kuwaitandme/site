Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->
    Stories.query().then (stories) ->  response.json stories
    .catch ->
      response.status 404
      response.json "no stories"


exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
