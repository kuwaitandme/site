validator = require 'validator'

exports = module.exports = (renderer, classified) ->
  controller = (request, response, next) ->
    # Get and validate the id
    id = request.params[0]
    if not validator.isMongoId id then return next()

    # Get the classified
    classified.get id, (error, classified) ->
      if error then return next error

      # Display 404 page if classified is not found
      if not classified then return next()
      if classified.authHash != request.query.authHash then return next()

      options =
        data: classified: classified
        description: classified.description
        page: 'classified/edit'
        title: response.__ 'title.classified.edit'
      renderer request, response, options, false

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true