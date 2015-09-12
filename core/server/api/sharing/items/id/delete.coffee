Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Promise.resolve request

    # Decide weither to query or to fetch a specific classified
    .then (request) ->
      id = request.params[0]
      if request.params.id? then patch request.params.id
      else Classifieds.query request.query

    # Return the result!
    .then (result) -> response.json result

    # Error handler
    .catch (e) -> next e


exports.APIroute = "/sharing/item/([0-9]+)"
exports["@require"] = [
  "$container"
  "models/sharing/items"
]
exports["@singleton"] = true
