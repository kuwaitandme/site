controller = module.exports =

  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    render = global.helpers.render
    render request, response,
      page: 'account/profile'
      title: response.__ 'title.account.profile'