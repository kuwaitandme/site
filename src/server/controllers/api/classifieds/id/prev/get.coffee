Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Promise.resolve request
    # Decide weither to query or to fetch a specific classified
    .then (request) ->
      id = request.params.id
      if request.params.id? then Classifieds.get request.params.id
      else Classifieds.query request.query

    # Return the result!
    .then (result) -> response.json result

    # Error handler
    .catch next


exports["@require"] = [
  "$container"

  "models/classifieds"
]
exports["@singleton"] = true
