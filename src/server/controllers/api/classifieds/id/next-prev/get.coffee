Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Promise.resolve request
    # Validate the parameters and create the query.
    .then (request) ->
      id = request.params[0]
      if request.params[1] == "next" then searchForward = true
      else searchForward = false
      parameters = status: Classifieds.statuses.ACTIVE
      [id, parameters, searchForward]
    .spread Classifieds.findNeighbouring
    # Return the result!
    .then (result) ->
      if result? and result.length is 1
        classified = result.toJSON()[0]
        response.json classified
      else
        error = new Error "classified not found"
        error.status = 404
        throw error
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