validator = require "validator"

exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    id = request.params.id

    _query = (request, response, next) ->
      parameters = request.query
      # parameters.status = Classifieds.statuses.ACTIVE
      Classifieds.query parameters, (error, classified={}) ->
        response.json classified, null, 2

    _single = (request, response, next) ->
      Classifieds.get id, (error, classified={}) ->
        response.json classified, null, 2

    if not id then _query request, response, next
    else _single request, response, next


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true