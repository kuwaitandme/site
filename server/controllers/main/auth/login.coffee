exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      page: 'auth/login'
      title: response.__ 'title.auth.login'

    renderer request, response, options, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true