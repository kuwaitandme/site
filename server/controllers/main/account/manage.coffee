exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated()
    #   return response.redirect '/auth/login?error=need_login'

    options =
      page: 'account/manage'
      title: response.__ 'title.account.manage'

    renderer request, response, options, true

exports['@require'] = [ 'controllers/renderer' ]
exports['@singleton'] = true