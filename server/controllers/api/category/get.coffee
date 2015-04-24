module.exports = (Classified, Category) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'

    if request.query.count
      classified = global.models.classified
      classified.classifiedsPerCategory (error, result) ->
        if error then next error

        json = JSON.stringify result
        response.end json
    else
      category = global.models.category
      category.getAll (error, result) ->
        if error then next error

        json = JSON.stringify result
        response.end json