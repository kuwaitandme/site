validator = require 'validator'


# Controller for the classified posting page. Creates a new classified and
# saves it to the database.
#
# If the post is successfully validated, create the post and redirect to the
# account page or else stay in the same page and display an error
controller = module.exports =
  get: (request, response, next) ->
    id = request.params.id
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
      render = global.helpers.render
      render request, response,
        data: classified: classified
        description: classified.description
        page: 'classified/single'
        title: classified.title