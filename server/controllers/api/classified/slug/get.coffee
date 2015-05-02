validator = require 'validator'

# singleController = require '../../controllers/classified/single'

exports = module.exports = (Classified) ->
  controller = (request, response, next) ->
    response.contentType 'application/json'
    slug = request.params.slug

    console.log request.params
    new Classified slug: slug
    .fetch().then (classified) ->
      response.end JSON.stringify classified, null, 2

exports['@require'] = [ 'models/classified' ]
exports['@singleton'] = true