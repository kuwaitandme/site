validator = require 'validator'

singleController = require '../../pages/classified/single'

module.exports = (request, response, next) ->
  response.contentType 'application/json'
  Classified = global.models.classified
  id = request.params.id

  if request.query.random
    return Classified.getRandom (error, classified) ->
      if error then next error
      response.redirect "/classified/#{classified._id}"
      # response.end JSON.stringify classified

  if not validator.isMongoId id
    response.status 404
    return response.end '{}'

  # Update the view counter asynchronously
  singleController.updateViewCount request, id

  # Retrieve classified from DB
  Classified.get id, (error, classified) ->
    if error then next error

    # If classified is not found then return 404
    if not classified
      response.status 404
      return response.end '{}'

    response.end JSON.stringify classified