Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Classifieds.query request.query
    .then (result) -> response.json result

    # Error handler
    .catch next


exports["@require"] = [
  "$container"

  "models/classifieds"
]
exports["@singleton"] = true
