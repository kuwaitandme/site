exports = module.exports = (location) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'
    location.getAll (error, result) ->
      if error then next error

      json = JSON.stringify result
      response.end json

exports['@require'] = [ 'models/location' ]
exports['@singleton'] = true