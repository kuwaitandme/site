exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: 'auth/login'
      title: response.__ 'title.auth.login'

    renderer request, response, args, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true