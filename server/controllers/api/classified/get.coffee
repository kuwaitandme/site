validator = require "validator"

exports = module.exports = (Classified, Classifieds) ->
  controller = (request, response, next) ->
    response.contentType "application/json"

    _query = (request, response, next) ->
      parameters = {} #getQueryParameters request
      Classifieds.forge parameters
      .query()
      .then (classified={}) -> response.end JSON.stringify classified, null, 2

    _single = (request, response, next) ->
      Classified.forge id: id
      .fetch()
      .then (classified={}) -> response.end JSON.stringify classified, null, 2

    id = request.params.id

    if not id then _query request, response, next
    _single request, response, next

    # if request.query.random
    #   return Classified.getRandom (error, classified) ->
    #     if error then next error
    #     response.redirect "/classified/#{classified._id}"
    #     # response.end JSON.stringify classified
    # # Update the view counter asynchronously
    # singleController.updateViewCount request, id


exports["@require"] = [
  "models/classified"
  "models/classifieds"
]
exports["@singleton"] = true