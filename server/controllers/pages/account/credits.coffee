# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect '/auth/login?error=need_login'

    args =
      page: 'account/credits'
      title: response.__('title.account.credits')
    render = global.helpers.render
    render request, response, args, true