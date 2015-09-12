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

    # Error handler
    .catch (e) -> next e



exports.APIroute = "/sharing/item/([0-9]+)/([^/]+)"
exports["@require"] = [
  "$container"
  "models/sharing/items"
]
exports["@singleton"] = true
