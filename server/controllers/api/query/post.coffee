# getQueryParameters = (require './helpers').getQueryParameters

exports = module.exports = (Classified) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'
    parameters = {} #getQueryParameters request

    page = request.query.page or 1

    finish = (error, classifieds) ->
      # console.log classifieds
      if error then next error
      else response.end JSON.stringify classifieds

    # response.end 's'
    # Classified.model.find {}, finish
    Classified.search parameters, page, false, finish

exports["@require"] = [ "models/classified" ]
exports["@singleton"] = true