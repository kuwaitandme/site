exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: 'auth/signup'
      title: response.__ 'title.auth.signup'

    renderer request, response, args, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true