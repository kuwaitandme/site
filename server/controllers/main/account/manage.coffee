controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    args =
      page: 'account/manage'
      title: response.__('title.account.manage')
      data: classifieds: []

    render = global.modules.renderer
    render request, response, args, true