Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Classifieds.query request.query
    # Return the result!
    .then (result) -> response.json result
    # If there were any errors, return it with a default 500 HTTP code.
    .catch (error) ->
      logger.error    error.stack
      response.status error.status or 500
      response.json   error.message


exports["@require"] = [
  "$container"

  "models/classifieds"
]
exports["@singleton"] = true
