Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->
    Stories.top().then (stories) ->  response.json stories
    .catch ->
      response.status 404
      response.json "no top stories"


exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
