validator = require 'validator'

# singleController = require '../../controllers/classified/single'

exports = module.exports = (Classified) ->
  controller = (request, response, next) ->
    _query = (request, response, next) ->
      parameters = {} #getQueryParameters request

      page = request.query.page or 1

      finish = (error, classifieds={}) ->
        # console.log classifieds
        if error then next error
        else response.end JSON.stringify classifieds
      Classified.search parameters, page, false, finish


    _single = (request, response, next) ->
      Classified.get id, (error, classified) ->
        if error then next error
        if not classified
          response.status 404
          response.end '{}'
        else
          response.end JSON.stringify classified

    response.contentType 'application/json'
    id = request.params.id

    if not validator.isMongoId id then _query request, response, next
    else _single request, response, next

    # if request.query.random
    #   return Classified.getRandom (error, classified) ->
    #     if error then next error
    #     response.redirect "/classified/#{classified._id}"
    #     # response.end JSON.stringify classified
    # # Update the view counter asynchronously
    # singleController.updateViewCount request, id


exports['@require'] = [ 'models/classified' ]
exports['@singleton'] = true