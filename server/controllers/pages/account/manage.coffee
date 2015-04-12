controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    args =
      page: 'account/manage'
      title: response.__('title.account.manage')
      data: classifieds: []

    render = global.helpers.render
    render request, response, args, true