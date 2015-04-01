module.exports = (request, response, next) ->
  response.contentType 'application/json'

  location = global.models.location
  location.getAll (error, result) ->
    if error then next error

    json = JSON.stringify result
    response.end json