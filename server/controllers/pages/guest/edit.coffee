validator = require 'validator'

controller = module.exports =
  get: (request, response, next) ->
    # Get and validate the id
    id = request.params.id
    if not validator.isMongoId id then return next()

    # Get the classified
    classified = global.models.classified
    classified.get id, (error, classified) ->
      if error then return next error

      console.log classified.authHash, request.query.authHash
      # Display 404 page if classified is not found
      if not classified then return next()
      if classified.authHash != request.query.authHash then return next()

      render = global.helpers.render
      render request, response,
        data: classified: classified
        description: classified.description
        page: 'classified/edit'
        title: response.__ 'title.classified.edit'