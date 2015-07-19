Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->
    console.log request.body
    request.body.created_by = request.user.id
    Stories.create request.body
    .then (story) ->  response.json story
    .catch (e) -> next e


exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
