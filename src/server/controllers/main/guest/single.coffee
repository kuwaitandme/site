validator = require "validator"

exports = module.exports = (renderer) ->
  controller = (request, response, next) ->

    id = request.params[0]
    authHash = request.query.authHash

    if not validator.isMongoId id or not /^[0-9A-Za-z-]*$/.test authHash
      return next()

    # Get the classified
    classified = global.models.classified
    classified.get id, (error, classified) ->

      # Display 404 page if classified is not found
      if not classified then return next()

      # Display 404 if classified is not a guest classified
      if not classified.guest then return next()

      # Display 404 if the authentication hash does not match
      if classified.authHash != authHash then return next()

      # Generate the response
      options =
        data: classified: classified
        description: classified.description
        page: "classified/single"
        title: classified.title
      renderer request, response, options, false


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true