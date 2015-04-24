getQueryParameters = (require './helpers').getQueryParameters

module.exports = (Classified) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'
    parameters = getQueryParameters request

    page = request.query.page or 1

    finish = (error, classifieds) ->
      if error then next error
      else response.end JSON.stringify classifieds

    Classified.search parameters, page, false, finish

exports["@require"] = [ "controllers/classified" ]
exports["@singleton"] = true