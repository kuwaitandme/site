Promise = require "bluebird"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->
    Promise.resolve request.params[0]
    # First validate the id, see if it's clean.
    .then (id) ->
      # If it wasn't then throw an error which will return a 404
      if not id? and not validator.isInt id, {max: 2147483647, min: 0}
        throw Error

      # All good, so now query the DB
      Stories.get request.params[0]
    .then (story) -> response.json story
    .catch ->
      response.status 404
      response.json {}


exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
