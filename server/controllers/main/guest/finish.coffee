exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      page: 'classified/finish'
      title: response.__ 'title.classified.finish'
    renderer request, response, options, false

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true