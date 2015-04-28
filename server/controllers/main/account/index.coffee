require './manage'
require './profile'
require './credits'

exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated()
    #   return response.redirect '/auth/login?error=need_login'

    options =
      page: 'account/index'
      title: response.__ 'title.account'

    renderer request, response, options, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true