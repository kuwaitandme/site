exports = module.exports = (Classified, Category) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'

    if request.query.count
      Classified.classifiedsPerCategory (error, result) ->
        if error then next error

        json = JSON.stringify result
        response.end json
    else
      Category.getAll (error, result) ->
        if error then next error

        json = JSON.stringify result
        response.end json

exports['@require'] = [
  'models/classified'
  'models/category'
]
exports['@singleton'] = true
# http://development.kuwaitandme.com/api/category