Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->

    Stories.upvote request.params[0], request.user.id
    .catch (e) -> response.status 400
    .finally -> response.json ""



exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
