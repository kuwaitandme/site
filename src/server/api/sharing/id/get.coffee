Promise   = require "bluebird"
validator = require "validator"

exports = module.exports = (IoC, Classifieds) ->
  logger = IoC.create "igloo/logger"

  controller = (request, response, next) ->
    Promise.resolve request
    # Validate the integer field
    .then (request) ->
      id = request.params[0]
      if not id? then throw new Error "id is missing"
      if not validator.isInt id then throw new Error "bad id"
      id
    .then Classifieds.get
    # Return the result!
    .then (result) ->
      if result? then response.json result
      else
        error = new Error "classified not found"
        error.status = 404
        throw error

    # Error handler
    .catch next

exports["@require"] = [
  "$container"

  "models/classifieds"
]
exports["@singleton"] = true
