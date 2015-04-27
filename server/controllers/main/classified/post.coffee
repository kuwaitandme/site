controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated() then return response.redirect '/auth/login?error=need_login'

    args =
      bodyid: 'classified-post'
      description: null
      page: 'classified/post'
      title: response.__ 'title.classified.post'

    render = global.modules.renderer
    render request, response, args, true