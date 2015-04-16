controller = module.exports =
  get: (request, response, next) ->
    args =
      bodyid: 'auth-forgot'
      page: 'auth/forgot'
      title: response.__('title.auth.forgot')

    render = global.modules.renderer
    render request, response, args, true